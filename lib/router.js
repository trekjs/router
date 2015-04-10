'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
/*!
 * router
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

const METHODS = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'];

const SNODE = 1; // Static node
const PNODE = 2; // Param node
const CNODE = 3; // Catch-all node

var Node = (function () {
  function Node(prefix, has, handler, edges) {
    _classCallCheck(this, Node);

    this.label = prefix.charCodeAt(0);
    this.prefix = prefix;
    this.has = has;
    this.handler = handler;
    this.edges = edges;
    if (!edges) this.edges = [];
  }

  Node.prototype.findEdge = function findEdge(c) {
    var i = 0;
    var l = this.edges.length;
    var e = void 0;

    for (; i < l; i++) {
      e = this.edges[i];
      // compare charCode
      if (e.label === c) return e;
    }
    return null;
  };

  Node.prototype.find = function find(path) {
    var n = arguments[1] === undefined ? 0 : arguments[1];
    var params = arguments[2] === undefined ? [] : arguments[2];

    var cn = this;
    var search = path;
    var result = [null, params];

    if (search.length === 0 || search === cn.prefix) {
      result[0] = cn.handler;
      if (cn.handler) {
        cn.handler.alias.forEach(function (a, i) {
          params[i].name = a;
        });
      }
      return result;
    }

    var pl = cn.prefix.length;
    var l = lcp(search, cn.prefix);
    if (l === pl) {
      search = search.substring(l);
    }

    for (var i = 0, k = cn.edges.length, e = undefined; i < k; i++) {
      e = cn.edges[i];
      var has = e.label === 58 ? PNODE : e.label === 42 ? CNODE : 0;
      if (has === CNODE) {
        // console.log('cnode', e.prefix)
        params[n] = {
          name: '_name',
          value: search
        };
        search = '';
      } else if (has === PNODE) {
        // console.log('pnode', e.prefix)
        l = search.length;
        // `/`
        for (var j = 0; j < l && search.charCodeAt(j) !== 47; j++) {}

        params[n] = {
          name: e.prefix.substring(1),
          value: search.substring(0, j)
        };
        n++;
        // console.log(search, search.substring(j))
        search = search.substring(j);
      }

      // console.log(e.label, e.prefix, has)
      var x = cn.findEdge(search.charCodeAt(0));
      if (x) {
        result = x.find(search, n, params);
        if (result[0]) break;
      } else {
        result = e.find(search, n, params);
        // if (result[0]) break;
      }
    }

    return result;
  };

  return Node;
})();

var Router = (function () {
  function Router() {
    var _this = this;

    _classCallCheck(this, Router);

    this.trees = Object.create(null);
    METHODS.forEach(function (m) {
      _this.trees[m.toUpperCase()] = new Node('', null, null, []);
    });
  }

  Router.prototype.format = function format(path) {
    var p = path;
    var k = -1;
    var alias = [];
    for (var i = 0, l = path.length; i < l; i++) {
      if (path.charCodeAt(i) === 58) {
        var j = 0;
        k++;
        for (; i < l && path.charCodeAt(i) !== 47; i++) {
          j++;
        }
        p = p.substring(0, i - j + 1 + (p.length - path.length)) + '$' + k + path.substring(i);
        alias.push(path.substring(i - j + 1, i));
      }
    }
    return [p, alias];
  };

  Router.prototype.add = function add(method, path, handler) {
    var _format = this.format(path);

    var p = _format[0];
    var alias = _format[1];

    if (handler) handler.alias = alias;
    path = p;
    for (var i = 0, l = path.length; i < l; i++) {
      // `:`
      if (path.charCodeAt(i) === 58) {
        this.insert(method, path.substring(0, i), null, PNODE);
        // `/`
        for (; i < l && path.charCodeAt(i) !== 47; i++) {}
        // for (; i < l && (path.charCodeAt(i) ^ 47); i++) {}
        if (i === l) {
          this.insert(method, path.substring(0, i), handler, 0);
          return;
        }
        this.insert(method, path.substring(0, i), null, 0);
        // `*`
      } else if (path.charCodeAt(i) === 42) {
        this.insert(method, path.substring(0, i), null, CNODE);
        this.insert(method, path.substring(0, l), handler, 0);
      }
    }
    this.insert(method, path, handler, SNODE, true);
  };

  // if bool is ture, push it to the top index of edges

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
          var _n = new Node(search.substring(l), has, handler, null);
          if (bool) cn.edges.unshift(_n);else cn.edges.push(_n);
        }
      } else if (l < sl) {
        search = search.substring(l);
        var e = cn.findEdge(search.charCodeAt(0));
        if (e) {
          // Go deeper
          cn = e;
          continue;
        }
        var n = new Node(search, has, handler, null);
        // cn.edges.push(n);
        if (bool) cn.edges.unshift(n);else cn.edges.push(n);
      } else {
        // Node already exists
        if (handler) {
          cn.handler = handler;
        }
      }
      return;
    }
  };

  Router.prototype.find = function find(method, path) {
    var cn = this.trees[method];
    return cn.find(path);
  };

  return Router;
})();

// Length of longest common prefix
function lcp(a, b) {
  var i = 0;
  var max = Math.min(a.length, b.length);
  for (; i < max && a.charCodeAt(i) === b.charCodeAt(i); i++) {}
  return i;
}

Router.Node = Node;

exports['default'] = Router;
module.exports = exports['default'];