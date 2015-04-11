'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
/*!
 * router
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

const min = Math.min;

const METHODS = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'];

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

var Node = (function () {
  function Node(prefix, has, handler, edges) {
    _classCallCheck(this, Node);

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
      _this.trees[m.toUpperCase()] = new Node('', null, null, []);
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
      if (ch === 58 /*':'*/) {
        // Param start index
        var j = i + 1;
        count++;

        this.insert(method, path.substring(0, i), null, PNODE);
        for (; i < l && path.charCodeAt(i) !== 47 /*'/'*/; ++i) {}

        // Create param key `$n`
        var param = '$' + count;
        var prefix = path.substring(0, j) + param;
        // Store original param key
        keys.push(path.substring(j, i));
        // Override path
        path = prefix + path.substring(i);
        // Override i, l
        i = prefix.length;
        l = path.length;

        if (i === l) {
          this.insert(method, path.substring(0, i), handler, 0);
          return;
        }
        this.insert(method, path.substring(0, i), null, 0);
      } else if (ch === 42 /*'*'*/) {
        this.insert(method, path.substring(0, i), null, CNODE);
        this.insert(method, path.substring(0, l), handler, 0);
      }
    }
    // unshift node
    this.insert(method, path, handler, SNODE, true);
  };

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

  Router.prototype.insert = function insert(method, path, handler, has) {
    var bool = arguments[4] === undefined ? false : arguments[4];

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
        cn.has = has;
        if (handler) {
          cn.handler = handler;
        }
      } else if (l < pl) {
        // Split node
        var n = new Node(cn.prefix.substring(l), cn.has, cn.handler, cn.edges);
        cn.edges = [n]; // Add to parent

        // Reset parent node
        cn.label = cn.prefix.charCodeAt(0);
        cn.prefix = cn.prefix.substring(0, l);
        cn.has = 0;
        cn.handler = null;

        if (l === sl) {
          // At parent node
          cn.handler = handler;
        } else {
          // Need to fork a node
          var _n = new Node(search.substring(l), has, handler);
          cn.edges[bool ? 'unshift' : 'push'](_n);
        }
      } else if (l < sl) {
        search = search.substring(l);
        var e = cn.findEdge(search.charCodeAt(0));
        if (e) {
          // Go deeper
          cn = e;
          continue;
        }
        // Create child node
        var n = new Node(search, has, handler);
        cn.edges[bool ? 'unshift' : 'push'](n);
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

    while (true) {
      // search ==== ''
      if (search.length === 0 || search === cn.prefix) {
        // Found
        result[0] = cn.handler;
        result[1] = params;
        if (cn.handler) {
          var keys = cn.handler.keys;
          for (var _i = 0, _l = keys.length; _i < _l; ++_i) {
            params[_i].name = keys[_i];
          }
        }
        return result;
      }

      var pl = cn.prefix.length;
      var l = lcp(search, cn.prefix);
      var e = undefined;

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
      e = cn.findEdge(58 /*':'*/);
      if (e) {
        cn = e;
        l = search.length;
        for (var i = 0; i < l && search.charCodeAt(i) !== 47 /*'/'*/; i++) {}

        params[n] = {
          name: e.prefix.substring(1),
          value: search.substring(0, i)
        };
        n++;

        search = search.substring(i);
        continue;
      }

      // Search CNODE
      e = cn.findEdge(42 /*'*'*/);
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

      return result;
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