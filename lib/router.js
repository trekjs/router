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
 * @param {Array} [keys]
 */

var Node = (function () {
  function Node(prefix, children, handler, keys) {
    _classCallCheck(this, Node);

    this.label = prefix.charCodeAt(0);
    this.prefix = prefix;
    this.children = children || [];
    this.handler = handler;
    this.keys = keys;
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
    var keys = []; // Store param keys
    var ch = undefined,
        j = undefined;

    for (; i < l; ++i) {
      ch = path.charCodeAt(i);
      if (ch === COLON) {
        // Param start index
        j = i + 1;

        this.insert(method, path.substring(0, i));
        for (; i < l && path.charCodeAt(i) !== SLASH; ++i) {}

        // Store original param key
        keys.push(path.substring(j, i));
        // Override path
        path = path.substring(0, j) + path.substring(i);
        // Override i, l
        i = j;
        l = path.length;

        if (i === l) {
          this.insert(method, path.substring(0, i), handler, keys);
          return;
        }
        this.insert(method, path.substring(0, i));
      } else if (ch === STAR) {
        this.insert(method, path.substring(0, i));
        this.insert(method, path.substring(0, l), handler, keys);
      }
    }
    this.insert(method, path, handler, keys);
  };

  /**
   * Insert new route
   *
   * @method insert
   * @private
   * @param {String} method
   * @param {String} path
   * @param {Function|GeneratorFunction} [handler]
   * @param {Array} [keys]
   */

  Router.prototype.insert = function insert(method, path, handler, keys) {
    var cn = this.trees[method]; // Current node as root
    var search = path;
    var sl = undefined,
        pl = undefined,
        l = undefined,
        n = undefined,
        e = undefined;

    while (true) {
      sl = search.length;
      pl = cn.prefix.length;
      l = lcp(search, cn.prefix);

      if (l === 0) {
        // At root node
        cn.label = search.charCodeAt(0);
        cn.prefix = search;
        if (handler) cn.handler = handler;
        if (keys) cn.keys = keys;
      } else if (l < pl) {
        // Split node
        n = new Node(cn.prefix.substring(l), cn.children, cn.handler, cn.keys);
        cn.children = [n]; // Add to parent

        // Reset parent node
        cn.label = cn.prefix.charCodeAt(0);
        cn.prefix = cn.prefix.substring(0, l);
        cn.handler = undefined;
        cn.keys = undefined;

        if (l === sl) {
          // At parent node
          if (handler) cn.handler = handler;
          if (keys) cn.keys = keys;
        } else {
          // Create child node
          n = new Node(search.substring(l), [], handler, keys);
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
        n = new Node(search, [], handler, keys);
        cn.children.push(n);
      } else {
        // Node already exists
        if (handler) cn.handler = handler;
        if (keys) cn.keys = keys;
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
    n = n || 0; // Param count
    cn = cn || this.trees[method]; // Current node as root
    result = result || [undefined, []];
    var search = path;
    var params = result[1];
    var pl = undefined,
        l = undefined,
        leq = undefined,
        e = undefined;
    var preSearch = undefined; // Pre search

    if (search.length === 0 || equalsLower(search, cn.prefix)) {
      // Found
      result[0] = cn.handler;
      result[1] = params;
      if (cn.handler !== undefined) {
        var keys = cn.keys;
        if (keys !== undefined) {
          var _i = 0;
          var _l = keys.length;
          for (; _i < _l; ++_i) {
            params[_i].name = keys[_i];
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
      for (var i = 0; i < l && search.charCodeAt(i) !== SLASH; i++) {}

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
      params.shift();
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
  var max = min(aLen, bLen);
  for (; i < max && a.charCodeAt(i) !== b.charCodeAt(i); ++i) {
    return false;
  }
  return true;
}

Router.METHODS = METHODS;

Router.Node = Node;

exports['default'] = Router;
module.exports = exports['default'];