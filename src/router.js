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
 * @param {Array} [children]
 * @param {Function|GeneratorFunction} handler
 */
class Node {

  constructor(prefix, children, handler) {
    this.label = prefix.charCodeAt(0);
    this.prefix = prefix;
    this.children = children || [];
    this.handler = handler;
  }

  /**
   * Find child by charCode
   *
   * @param {Number} char code
   * @return {Node|undefined} node
   */
  findChild(c) {
    let [i, l, e] = [0, this.children.length, undefined];
    for (; i < l; ++i) {
      e = this.children[i];
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
    // Store param keys
    let keys = [];
    if (handler) handler.keys = keys;

    let i = 0;
    let l = path.length
    let ch, j;

    for (; i < l; ++i) {
      ch = path.charCodeAt(i);
      if (ch === COLON) {
        // Param start index
        j = i + 1;

        this.insert(method, path.substring(0, i));
        for (; i < l && (path.charCodeAt(i) !== SLASH); ++i) {}

        // Store original param key
        keys.push(path.substring(j, i));
        // Override path
        path = path.substring(0, j) + path.substring(i);
        // Override i, l
        i = j;
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
   */
  insert(method, path, handler) {
    let cn = this.trees[method]; // Current node as root
    let search = path;
    let sl, pl, l, n, e;

    while (true) {
      sl = search.length;
      pl = cn.prefix.length;
      l = lcp(search, cn.prefix);

      if (l === 0) {
        // At root node
        cn.label = search.charCodeAt(0);
        cn.prefix = search;
        if (handler) {
          cn.handler = handler;
        }
      } else if (l < pl) {
        // Split node
        n = new Node(cn.prefix.substring(l), cn.children, cn.handler);
        cn.children = [n]; // Add to parent

        // Reset parent node
        cn.label = cn.prefix.charCodeAt(0);
        cn.prefix = cn.prefix.substring(0, l);
        cn.handler = undefined;

        if (l === sl) {
          // At parent node
          cn.handler = handler;
        } else {
          // Create child node
          n = new Node(search.substring(l), [], handler);
          cn.children.push(n);
        }
      } else if (l < sl) {
        search = search.substring(l);
        e = cn.findChild(search.charCodeAt(0));
        if (e !== undefined) {
          // Go deeper
          cn = e;
          continue;
        }
        // Create child node
        n = new Node(search, [], handler);
        cn.children.push(n);
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
  find(method, path, cn, n, result) {
    n = n || 0; // Param count
    cn = cn || this.trees[method]; // Current node as root
    result = result || [undefined, []];
    // let n = 0; // Param count
    // let cn = this.trees[method]; // Current node as root
    // let result = [undefined, []];
    let search = path;
    let params = result[1];
    let pl, l, leq, e;
    let preSearch; // Pre search

    if (search.length === 0 || search === cn.prefix) {
      // Found
      result[0] = cn.handler;
      result[1] = params;
      if (cn.handler !== undefined) {
        let keys = cn.handler.keys;
        let i = 0, l = keys.length;
        for (; i < l; ++i) {
          params[i].name = keys[i];
        }
      }
      return result;
    }

    pl = cn.prefix.length;
    l = lcp(search, cn.prefix);
    leq = l === pl;

    if (leq) {
      search = search.substring(l);
    }
    preSearch = search;

    // Static node
    e = cn.findChild(search.charCodeAt(0));
    if (e !== undefined) {
      this.find(method, search, e, n, result);
      if (result[0] !== undefined) return result;
      search = preSearch;
    }

    // Not found static node
    if (!leq) {
      return result;
    }

    e = cn.findChild(COLON);
    if (e !== undefined) {
      l = search.length;
      for (var i = 0; i < l && (search.charCodeAt(i) !== SLASH); i++) {}

      params[n] = {
        name: e.prefix.substring(1),
        value: search.substring(0, i)
      };

      n++;
      preSearch = search;
      search = search.substring(i);

      this.find(method, search, e, n, result);
      if (result[0] !== undefined) return result;

      n--;
      params.shift()
      search = preSearch;
    }

    // Catch-all node
    e = cn.findChild(STAR);
    if (e !== undefined) {
      params[n] = {
        name: '_name',
        value: search
      };
      search = ''; // End search
      this.find(method, search, e, n, result);
    }

    return result;
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
