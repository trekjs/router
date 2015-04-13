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
 * Node
 *
 * @class Node
 * @constructor
 * @param {String} path
 * @param {Node} parent
 * @param {Array} [edges]
 * @param {Function|GeneratorFunction} handler
 */

var Node = (function () {
  function Node(prefix, parent, edges, handler) {
    _classCallCheck(this, Node);

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

  Node.prototype.findEdge = function findEdge(c) {
    var i = 0;
    var l = this.edges.length;
    var e = undefined;

    for (; i < l; ++i) {
      e = this.edges[i];
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
    // Count params
    var count = -1;
    // Store param keys
    var keys = [];
    if (handler) handler.keys = keys;

    var i = 0;
    var l = path.length;
    var ch = undefined;

    for (; i < l; ++i) {
      ch = path.charCodeAt(i);
      if (ch === COLON) {
        // Param start index
        var j = i + 1;
        count++;

        this.insert(method, path.substring(0, i));
        for (; i < l && path.charCodeAt(i) !== SLASH; ++i) {}

        // Create param key `$n`
        var _param = '$' + count;
        var prefix = path.substring(0, j) + _param;
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
  };

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

  Router.prototype.insert = function insert(method, path, handler) {
    var cn = this.trees[method]; // Current node as root
    var search = path;

    while (true) {
      var sl = search.length;
      var pl = cn.prefix.length;
      var l = lcp(search, cn.prefix);

      if (l === 0) {
        // At root node
        cn.label = search.charCodeAt(0);
        cn.prefix = search;
        if (handler) {
          cn.handler = handler;
        }
      } else if (l < pl) {
        // Split node
        var n = new Node(cn.prefix.substring(l), cn, cn.edges, cn.handler);
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
          var _n = new Node(search.substring(l), cn, [], handler);
          cn.edges.push(_n);
        }
      } else if (l < sl) {
        search = search.substring(l);
        var e = cn.findEdge(search.charCodeAt(0));
        if (e !== undefined) {
          // Go deeper
          cn = e;
          continue;
        }
        // Create child node
        var n = new Node(search, cn, [], handler);
        cn.edges.push(n);
      } else {
        // Node already exists
        if (handler) {
          cn.handler = handler;
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
   * @property {NULL|Function|GeneratorFunction} result[0]
   * @property {Array} result[1]
   */

  Router.prototype.find = function find(method, path) {
    var cn = this.trees[method]; // Current node as root
    var search = path;
    var n = 0; // Param count
    var result = Array(2);
    var params = result[1] = [];
    var preSearch = search; // Pre search

    // Search order static > param > catch-all
    walk: while (true) {
      if (search.length === 0 || search === cn.prefix) {
        // Found
        result[0] = cn.handler;
        result[1] = params;
        if (cn.handler !== undefined) {
          var keys = cn.handler.keys;
          for (var _i = 0, _l = keys.length; _i < _l; ++_i) {
            params[_i].name = keys[_i];
          }
        }
        return result;
      }

      var pl = cn.prefix.length;
      var l = lcp(search, cn.prefix);
      var leq = l === pl;
      var e = undefined;

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
      param: while (true) {

        e = cn.findEdge(COLON);
        if (e !== undefined) {
          l = search.length;
          for (var i = 0; i < l && search.charCodeAt(i) !== SLASH; i++) {}

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

Router.Node = Node;

exports['default'] = Router;
module.exports = exports['default'];