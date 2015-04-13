/*!
 * router
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

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

const min = Math.min;

const STAR = 42; // '*'
const SLASH = 47; // '/'
const COLON = 58; // ':'

/**
 * Node
 *
 * @class Node
 * @constructor
 * @param {String} path
 * @param {Node} parent
 * @param {Array} [edges]
 * @param {Function|GeneratorFunction} handler
 */
class Node {

  constructor(prefix, parent, edges, handler) {
    this.label = prefix.charCodeAt(0);
    this.prefix = prefix;
    this.parent = parent;
    this.edges = edges || [];
    this.handler = handler;
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
      // Start from '/'
      this.trees[m.toUpperCase()] = new Node('/');
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
      if (ch === COLON) {
        // Param start index
        let j = i + 1;
        count++;

        this.insert(method, path.substring(0, i));
        for (; i < l && (path.charCodeAt(i) !== SLASH); ++i) {}

        // Create param key `$n`
        let param = '$' + count;
        let prefix = path.substring(0, j) + param;
        // Store original param key
        keys.push(path.substring(j, i));
        // Override path
        path = prefix + path.substring(i);
        // Override i, l
        i = prefix.length;
        l = path.length;

        if (i === l) {
          this.insert(method, path.substring(0, i), handler);
          return;
        }
        this.insert(method, path.substring(0, i));
      } else if (ch === STAR) {
        this.insert(method, path.substring(0, i));
        this.insert(method, path.substring(0, l), handler);
      }
    }
    // unshift node
    this.insert(method, path, handler);
  }

  /**
   * Insert new route
   *
   * @method insert
   * @private
   * @param {String} method
   * @param {String} path
   * @param {Function|GeneratorFunction} handler
   * @param {Boolean} [bool=false] if bool is true, unshift it to edges
   */
  insert(method, path, handler) {
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
        if (handler) {
          cn.handler = handler;
        }
      } else if (l < pl) {
        // Split node
        let n = new Node(cn.prefix.substring(l), cn, cn.edges, cn.handler);
        cn.edges = [n]; // Add to parent

        // Reset parent node
        cn.label = cn.prefix.charCodeAt(0);
        cn.prefix = cn.prefix.substring(0, l);
        cn.handler = undefined;

        if (l === sl) {
          // At parent node
          cn.handler = handler;
        } else {
          // Create child node
          let n = new Node(search.substring(l), cn, [], handler);
          cn.edges.push(n);
        }
      } else if (l < sl) {
        search = search.substring(l);
        let e = cn.findEdge(search.charCodeAt(0));
        if (e !== undefined) {
          // Go deeper
          cn = e;
          continue;
        }
        // Create child node
        let n = new Node(search, cn, [], handler);
        cn.edges.push(n);
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
    let preSearch = search; // Pre search

    // Search order static > param > catch-all
    walk:
      while (true) {
        if (search.length === 0 || search === cn.prefix) {
          // Found
          result[0] = cn.handler;
          result[1] = params;
          if (cn.handler !== undefined) {
            let keys = cn.handler.keys;
            for (let i = 0, l = keys.length; i < l; ++i) {
              params[i].name = keys[i];
            }
          }
          return result;
        }

        let pl = cn.prefix.length;
        let l = lcp(search, cn.prefix);
        let leq = l === pl;
        let e;

        if (leq) {
          search = search.substring(l);
        }

        // Static node
        e = cn.findEdge(search.charCodeAt(0));
        if (e !== undefined) {
          cn = e;
          preSearch = search;
          continue;
        }

        // Not found static node
        if (!leq) {
          return result;
        }

        // Param node
        param:
          while (true) {

            e = cn.findEdge(COLON);
            if (e !== undefined) {
              l = search.length;
              for (var i = 0; i < l && (search.charCodeAt(i) !== SLASH); i++) {}

              params[n] = {
                name: e.prefix.substring(1),
                value: search.substring(0, i)
              };
              n++;

              cn = e;
              preSearch = search;
              search = search.substring(i);
              continue walk;
            }

            // Catch-all node
            e = cn.findEdge(STAR);
            if (e !== undefined) {
              params[n] = {
                name: '_name',
                value: search
              };
              cn = e;
              search = ''; // End search
              continue walk;
            }

            if (cn.parent !== undefined) {
              cn = cn.parent;
              search = preSearch;
              continue param;
            }

            return result;
          }

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
