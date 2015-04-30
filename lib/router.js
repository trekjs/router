'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
/*!
 * router
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

const METHODS = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'];

const min = Math.min;

const STAR = 42; // '*'
const SLASH = 47; // '/'
const COLON = 58; // ':'

/**
 * Route Node
 *
 * @class Node
 * @constructor
 * @param {String} path
 * @param {Array} [children]
 * @param {Function|GeneratorFunction} handler
 * @param {Array} [pnames]
 */

var Node = (function () {
  function Node(prefix, children, handler, pnames) {
    _classCallCheck(this, Node);

    this.label = prefix.charCodeAt(0);
    this.prefix = prefix;
    this.children = children || [];
    this.handler = handler;
    this.pnames = pnames;
  }

  /**
   * Find child node by charCode
   *
   * @param {Number} char code
   * @return {Node|undefined} node
   */

  Node.prototype.findChild = function findChild(c) {
    var i = 0;
    var l = this.children.length;
    var e = undefined;

    for (; i < l; ++i) {
      e = this.children[i];
      // Compare charCode
      if (e.label === c) return e;
    }
    return undefined;
  };

  return Node;
})();

/**
 * Router
 *
 * @class Router
 * @constructor
 */

var Router = (function () {
  function Router() {
    var _this = this;

    _classCallCheck(this, Router);

    this.trees = Object.create(null);
    METHODS.forEach(function (m) {
      // Start from '/'
      _this.trees[m.toUpperCase()] = new Node('/');
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

  Router.prototype.add = function add(method, path, handler) {
    var i = 0;
    var l = path.length;
    var pnames = []; // Param names
    var ch = undefined,
        j = undefined;

    for (; i < l; ++i) {
      ch = path.charCodeAt(i);
      if (ch === COLON) {
        j = i + 1;

        this.insert(method, path.substring(0, i));
        for (; i < l && path.charCodeAt(i) !== SLASH; ++i) {}

        pnames.push(path.substring(j, i));
        path = path.substring(0, j) + path.substring(i);
        i = j;
        l = path.length;

        if (i === l) {
          this.insert(method, path.substring(0, i), handler, pnames);
          return;
        }
        this.insert(method, path.substring(0, i));
      } else if (ch === STAR) {
        this.insert(method, path.substring(0, i));
        this.insert(method, path.substring(0, l), handler, pnames);
        return;
      }
    }
    this.insert(method, path, handler, pnames);
  };

  /**
   * Insert new route
   *
   * @method insert
   * @private
   * @param {String} method
   * @param {String} path
   * @param {Function|GeneratorFunction} [handler]
   * @param {Array} [pnames]
   */

  Router.prototype.insert = function insert(method, path, handler, pnames) {
    var cn = this.trees[method]; // Current node as root
    var search = path;
    var sl = undefined,
        pl = undefined,
        l = undefined,
        n = undefined,
        c = undefined;

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
          cn.pnames = pnames;
        }
      } else if (l < pl) {
        // Split node
        n = new Node(cn.prefix.substring(l), cn.children, cn.handler, cn.pnames);
        cn.children = [n]; // Add to parent

        // Reset parent node
        cn.label = cn.prefix.charCodeAt(0);
        cn.prefix = cn.prefix.substring(0, l);
        cn.handler = undefined;
        cn.pnames = undefined;

        if (l === sl) {
          // At parent node
          cn.handler = handler;
          cn.pnames = pnames;
        } else {
          // Create child node
          n = new Node(search.substring(l), [], handler, pnames);
          cn.children.push(n);
        }
      } else if (l < sl) {
        search = search.substring(l);
        c = cn.findChild(search.charCodeAt(0));
        if (c !== undefined) {
          // Go deeper
          cn = c;
          continue;
        }
        // Create child node
        n = new Node(search, [], handler, pnames);
        cn.children.push(n);
      } else {
        // Node already exists
        if (handler) {
          cn.handler = handler;
          cn.pnames = pnames;
        }
      }
      return;
    }
  };

  /**
   * Find route by method and path
   *
   * @method find
   * @param {String} method
   * @param {String} path
   * @return {Array} result
   * @property {Undefined|Function|GeneratorFunction} result[0]
   * @property {Array} result[1]
   */

  Router.prototype.find = function find(method, path, cn, n, result) {
    cn = cn || this.trees[method]; // Current node as root
    n = n || 0; // Param count
    result = result || [undefined, []];
    var search = path;
    var params = result[1]; // Params
    var pl = undefined,
        l = undefined,
        leq = undefined,
        c = undefined;
    var preSearch = undefined; // Pre search

    // Search order static > param > match-any
    if (search.length === 0 || equalsLower(search, cn.prefix)) {
      // Found
      result[0] = cn.handler;
      if (cn.handler !== undefined) {
        var pnames = cn.pnames;
        if (pnames !== undefined) {
          var _i = 0;
          var _l = pnames.length;
          for (; _i < _l; ++_i) {
            params[_i].name = pnames[_i];
          }
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
    c = cn.findChild(search.charCodeAt(0));
    if (c !== undefined) {
      this.find(method, search, c, n, result);
      if (result[0] !== undefined) return result;
      search = preSearch;
    }

    // Not found node
    if (!leq) {
      return result;
    }

    // Param node
    c = cn.findChild(COLON);
    if (c !== undefined) {
      l = search.length;
      for (var i = 0; i < l && search.charCodeAt(i) !== SLASH; ++i) {}

      params[n] = {
        value: search.substring(0, i)
      };

      n++;
      preSearch = search;
      search = search.substring(i);

      this.find(method, search, c, n, result);
      if (result[0] !== undefined) return result;

      n--;
      params.shift();
      search = preSearch;
    }

    // Match-any node
    c = cn.findChild(STAR);
    if (c !== undefined) {
      params[n] = {
        name: '_name',
        value: search
      };
      search = ''; // End search
      this.find(method, search, c, n, result);
    }

    return result;
  };

  return Router;
})();

// Length of longest common prefix
function lcp(a, b) {
  var i = 0;
  var max = min(a.length, b.length);
  for (; i < max && a.charCodeAt(i) === b.charCodeAt(i); ++i) {}
  return i;
}

function equalsLower(a, b) {
  var aLen = a.length;
  var bLen = b.length;
  if (aLen !== bLen) return false;
  var i = 0;
  for (; i < aLen && a.charCodeAt(i) !== b.charCodeAt(i); ++i) {
    return false;
  }
  return true;
}

Router.METHODS = METHODS;

Router.Node = Node;

exports['default'] = Router;
module.exports = exports['default'];