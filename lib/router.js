'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
/*!
 * router
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

const METHODS = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'];

const SNODE = 0; // Static node
const PNODE = 1; // Param node
const ANODE = 2; // Catch-all node

let Node = (function () {
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
    let i = 0;
    let l = this.edges.length;
    let e = void 0;

    for (; i < l; i++) {
      e = this.edges[i];
      // compare charCode
      if (e.label === c) return e;
    }
    return null;
  };

  return Node;
})();

let Router = (function () {
  function Router() {
    var _this = this;

    _classCallCheck(this, Router);

    this.trees = Object.create(null);
    METHODS.forEach(function (m) {
      _this.trees[m.toUpperCase()] = new Node('', null, null, []);
    });
  }

  Router.prototype.add = function add(method, path, handler) {
    for (let i = 0, l = path.length; i < l; i++) {
      // `:`
      if (path.charCodeAt(i) === 58) {
        this.insert(method, path.substring(0, i), null, PNODE);
        // `/`
        for (; i < l && path.charCodeAt(i) !== 47; i++) {}
        // for (; i < l && (path.charCodeAt(i) ^ 47); i++) {}
        if (i === l) {
          this.insert(method, path.substring(0, i), handler, SNODE);
          return;
        }
        this.insert(method, path.substring(0, i), null, SNODE);
        // `*`
      } else if (path.charCodeAt(i) === 42) {
        this.insert(method, path.substring(0, i), handler, ANODE);
      }
    }
    this.insert(method, path, handler, SNODE);
  };

  Router.prototype.insert = function insert(method, path, handler, has) {
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
        return;
      } else if (l < pl) {
        // Split the node
        let n = new Node(cn.prefix.substring(l), cn.has, cn.handler, cn.edges);
        cn.edges = [n]; // Add to parent

        // Reset parent node
        cn.label = cn.prefix.charCodeAt(0);
        cn.prefix = cn.prefix.substring(0, l);
        cn.has = SNODE;
        cn.handler = null;

        if (l === sl) {
          // At parent node
          cn.handler = handler;
        } else {
          // Need to fork a node
          let n = new Node(search.substring(l), has, handler, null);
          cn.edges.push(n);
        }
        break;
      } else if (l < sl) {
        search = search.substring(l);
        let e = cn.findEdge(search.charCodeAt(0));
        if (e) {
          cn = e;
        } else {
          let n = new Node(search, has, handler, []);
          cn.edges.push(n);
          break;
        }
      } else {
        // Node already exists
        if (handler) {
          cn.handler = handler;
        }
        break;
      }
    }
  };

  Router.prototype.find = function find(method, path) {
    let cn = this.trees[method]; // Current node as root
    let search = path;
    let n = 0; // Param count
    let result = [null, []];
    let params = result[1];

    while (true) {
      // search ==== ''
      if (search.length === 0 || search === cn.prefix) {
        // Found
        result[0] = cn.handler;
        result[1] = params;
        return result;
      }

      let pl = cn.prefix.length;
      let l = lcp(search, cn.prefix);

      if (l === pl) {
        search = search.substring(l);
        if (cn.has === PNODE) {
          // Param node
          cn = cn.edges[0];
          l = search.length;
          // `/`
          for (var i = 0; i < l && search.charCodeAt(i) !== 47; i++) {}
          // for (var i = 0; i < l && (search.charCodeAt(i) ^ 47); i++) {}

          params[n] = {
            name: cn.prefix.substring(1),
            value: search.substring(0, i)
          };
          n++;

          search = search.substring(i);
        } else if (cn.has === ANODE) {
          // Catch-all node
          params[n] = {
            name: cn.prefix.substring(1),
            value: search
          };
          search = ''; // End search
        }

        // search === ''
        if (search.length === 0) {
          continue;
        }

        // Dig more
        let e = cn.findEdge(search.charCodeAt(0));
        if (!e) {
          // Not found
          return result;
        }
        cn = e;
        continue;
      }
      return result;
    }
  };

  return Router;
})();

// Length of longest common prefix
function lcp(a, b) {
  let i = 0;
  let max = Math.min(a.length, b.length);
  for (; i < max && a.charCodeAt(i) === b.charCodeAt(i); i++) {}
  return i;
}

Router.Node = Node;

exports['default'] = Router;
module.exports = exports['default'];