/*!
 * router
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

const min = Math.min;

const METHODS = [
  'CONNECT',
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
  'TRACE'
];

const SNODE = 1; // Static node
const PNODE = 2; // Param node
const CNODE = 3; // Catch-all node

/**
 * Node
 *
 * @class Node
 * @constructor
 * @param {String} path
 * @param {Number} has
 * @param {Function|GeneratorFunction} handler
 * @param {Array} [edges]
 */
class Node {

  constructor(prefix, has, handler, edges) {
    this.label = prefix.charCodeAt(0);
    this.prefix = prefix;
    this.has = has;
    this.handler = handler;
    this.edges = edges || [];
  }

  /**
   * Find edge by charCode
   *
   * @param {Number} char code
   * @return {Node|undefined} node
   */
  findEdge(c) {
    let [i, l, e] = [0, this.edges.length, undefined];
    for (; i < l; ++i) {
      e = this.edges[i];
      // Compare charCode
      if (e.label === c) return e;
    }
    return undefined;
  }

}

/**
 * Router
 *
 * @class Router
 * @constructor
 */
class Router {

  constructor() {
    this.trees = Object.create(null);
    METHODS.forEach((m) => {
      this.trees[m.toUpperCase()] = new Node('', null, null, []);
    });
  }

  /**
   * Add new route
   *
   * @method add
   * @param {String} method
   * @param {String} path
   * @param {Function|GeneratorFunction} handler
   */
  add(method, path, handler) {
    // Count params
    let count = -1;
    // Store param keys
    let keys = [];
    if (handler) handler.keys = keys;

    let i = 0;
    let l = path.length
    let ch;

    for (; i < l; ++i) {
      ch = path.charCodeAt(i);
      if (ch === 0x3A /*':'*/) {
        // Param start index
        let j = i + 1;
        count++;

        this.insert(method, path.slice(0, i), null, PNODE);
        for (; i < l && (path.charCodeAt(i) !== 0x2F /*'/'*/); ++i) {}

        // Create param key `$n`
        let param = '$' + count;
        let prefix = path.slice(0, j) + param;
        // Store original param key
        keys.push(path.slice(j, i));
        // Override path
        path = prefix + path.slice(i);
        // Override i, l
        i = prefix.length;
        l = path.length;

        if (i === l) {
          this.insert(method, path.slice(0, i), handler, 0);
          return;
        }
        this.insert(method, path.slice(0, i), null, 0);
      } else if (ch === 0x2A /*'*'*/) {
        this.insert(method, path.slice(0, i), null, CNODE);
        this.insert(method, path.slice(0, l), handler, 0);
      }
    }
    this.insert(method, path, handler, SNODE, true);
  }

  /**
   * Insert new route
   *
   * @method insert
   * @private
   * @param {String} method
   * @param {String} path
   * @param {Function|GeneratorFunction} handler
   * @param {Number} has
   * @param {Boolean} [bool=false] if bool is true, unshift it to edges
   */
  insert(method, path, handler, has, bool = false) {
    let cn = this.trees[method]; // Current node as root
    let search = path;

    while (true) {
      let sl = search.length;
      let pl = cn.prefix.length;
      let l = lcp(search, cn.prefix);

      if (l === 0) {
        // At root node
        cn.label = search.charCodeAt(0);
        cn.prefix = search;
        cn.has = has;
        if (handler) {
          cn.handler = handler;
        }
      } else if (l < pl) {
        // Split node
        let n = new Node(cn.prefix.slice(l), cn.has, cn.handler, cn.edges);
        cn.edges = [n]; // Add to parent

        // Reset parent node
        cn.label = cn.prefix.charCodeAt(0);
        cn.prefix = cn.prefix.slice(0, l);
        cn.has = 0;
        cn.handler = null;

        if (l === sl) {
          // At parent node
          cn.handler = handler;
        } else {
          // Need to fork a node
          let n = new Node(search.slice(l), has, handler);
          // cn.edges.push(n);
          cn.edges[bool ? 'unshift' : 'push'](n);
        }
      } else if (l < sl) {
        search = search.slice(l);
        let e = cn.findEdge(search.charCodeAt(0));
        if (e) {
          // Go deeper
          cn = e;
          continue;
        }
        // Create child node
        let n = new Node(search, has, handler);
        // cn.edges.push(n);
        cn.edges[bool ? 'unshift' : 'push'](n);
      } else {
        // Node already exists
        if (handler) {
          cn.handler = handler;
        }
      }
      return;
    }
  }

  /**
   * Find route by method and path
   *
   * @method find
   * @param {String} method
   * @param {String} path
   * @param {Node} [cn]
   * @param {Number} {n=0}
   * @param {Array} {params=[]}
   * @return {Array} result
   * @property {NULL|Function|GeneratorFunction} result[0]
   * @property {Array} result[1]
   */
  oldFind(method, path, cn, n = 0, params = []) {
    cn = cn || this.trees[method];
    let search = path;
    let result = Array(2);
    result[1] = params;

    if (search.length === 0 || search === cn.prefix) {
      result[0] = cn.handler;
      if (cn.handler && cn.handler.keys) {
        for (let i = 0, l = cn.handler.keys.length; i < l; ++i) {
          params[i].name = cn.handler.keys[i];
        }
      }
      return result;
    }

    let pl = cn.prefix.length;
    let l = lcp(search, cn.prefix);
    if (l === pl) {
      search = search.slice(l);
    }

    let i = 0, k = cn.edges.length, e;
    for (; i < k; ++i) {
      e = cn.edges[i];
      let has = e.label === 0x3A /*':'*/ ? PNODE : (e.label === 0x2A /*'*'*/ ? CNODE : 0);
      if (has === PNODE) {
        l = search.length;
        let j = 0;
        for (; j < l && (search.charCodeAt(j) !== 0x2F /*'/'*/); ++j) {}

        params[n] = {
          name: e.prefix.slice(1),
          value: search.slice(0, j)
        };
        n++;
        search = search.slice(j);
      } else if (has === CNODE) {
        params[n] = {
          name: '_name',
          value: search
        };
        search = '';
      }

      let x = cn.findEdge(search.charCodeAt(0));
      if (x === undefined) {
        result = this.find(method, search, e, n, params);
        // if (result[0]) break;
      } else {
        result = this.find(method, search, x, n, params);
        if (result[0]) break;
      }
    }

    return result;
  }

  /**
   * Find route by method and path
   *
   * @method find
   * @param {String} method
   * @param {String} path
   * @return {Array} result
   * @property {NULL|Function|GeneratorFunction} result[0]
   * @property {Array} result[1]
   */
  find(method, path) {
    let cn = this.trees[method]; // Current node as root
    let search = path;
    let n = 0; // Param count
    let result = Array(2);
    let params = result[1] = [];

    while (true) {
      // search ==== ''
      if (search.length === 0 || search === cn.prefix) {
        // Found
        result[0] = cn.handler;
        result[1] = params;
        if (cn.handler) {
          let keys = cn.handler.keys;
          for (let i = 0, l = keys.length; i < l; ++i) {
            params[i].name = keys[i];
          }
        }
        return result;
      }

      let pl = cn.prefix.length;
      let l = lcp(search, cn.prefix);
      let e;

      if (l === pl) {
        search = search.substring(l);
      }

      // Search SNODE
      e = cn.findEdge(search.charCodeAt(0));
      if (e) {
        cn = e;
        continue;
      }

      // Search PNODE
      e = cn.findEdge(0x3A /*':'*/);
      if (e) {
        cn = e;
        l = search.length;
        for (var i = 0; i < l && (search.charCodeAt(i) !== 0x2F /*'/'*/); i++) {}

        params[n] = {
          name: e.prefix.substring(1),
          value: search.substring(0, i)
        };
        n++;

        search = search.substring(i)
        continue;
      } else {
        // Search CNODE
        e = cn.findEdge(0x2A /*'*'*/);
        if (e) {
          cn = e;
          // Catch-all node
          params[n] = {
            name: '_name',
            value: search
          };
          search = ''; // End search
        }

        if (search.length === 0) {
          continue;
        }

      }

      return result;
    }
  }

}

// Length of longest common prefix
function lcp(a, b) {
  let i = 0;
  let max = min(a.length, b.length);
  for (; i < max && (a.charCodeAt(i) === b.charCodeAt(i)); ++i) {}
  return i;
}

Router.Node = Node;

export default Router;
