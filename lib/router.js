"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*!
 * router
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var methods = _interopRequire(require("methods"));

var SNODE = 0;
var PNODE = 1;
var ANODE = 2;

var Node = (function () {
  function Node(prefix, has, handler, edges) {
    _classCallCheck(this, Node);

    this.label = prefix[0];
    this.prefix = prefix;
    this.has = has;
    this.handler = handler;
    this.edges = edges;
    if (!edges) this.edges = [];
  }

  _createClass(Node, {
    findEdge: {
      value: function findEdge(c) {
        var i = 0;
        var l = this.edges.length;
        var e = void 0;

        for (; i < l; i++) {
          e = this.edges[i];
          if (e.label === c) {
            return e;
          }
        }
        return null;
      }
    }
  });

  return Node;
})();

var Router = (function () {
  function Router() {
    var _this = this;

    _classCallCheck(this, Router);

    this.trees = Object.create(null);
    methods.forEach(function (m) {
      _this.trees[m] = new Node("", null, null, []);
    });
  }

  _createClass(Router, {
    add: {
      value: function add(method, path, handler) {
        var i = 0,
            l = path.length;
        for (; i < l; i++) {
          // `:`
          if (path.charCodeAt(i) === 58) {
            this.insert(method, path.substring(0, i), null, PNODE);
            // `/`
            for (; i < l && path.charCodeAt(i) !== 47; i++) {}
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
      }
    },
    insert: {
      value: function insert(method, path, handler, has) {
        var cn = this.trees[method];
        var search = path;

        while (true) {
          var sl = search.length;
          var pl = cn.prefix.length;
          var l = lcp(search, cn.prefix);

          if (l === 0) {
            // At root node
            cn.label = search[0];
            cn.prefix = search;
            cn.has = has;
            if (handler) {
              cn.handler = handler;
            }
            return;
          } else if (l < pl) {
            // Split the node
            var n = new Node(cn.prefix.substring(l), cn.has, cn.handler, cn.edges);
            cn.edges = [n]; // Add to parent

            // Reset parent node
            cn.label = cn.prefix[0];
            cn.prefix = cn.prefix.substring(0, l);
            cn.has = SNODE;
            cn.handler = null;

            if (l === sl) {
              // At parent node
              cn.handler = handler;
            } else {
              // Need to fork a node
              var _n = new Node(search.substring(l), has, null, null);
              _n.handler = handler;
              cn.edges.push(_n);
            }
            break;
          } else if (l < sl) {
            search = search.substring(l);
            var e = cn.findEdge(search[0]);
            if (!e) {
              var n = new Node(search, has, null, null);
              if (handler) {
                n.handler = handler;
              }
              cn.edges.push(n);
              break;
            } else {
              cn = e;
            }
          } else {
            // Node already exists
            if (handler) {
              cn.handler = handler;
            }
            break;
          }
        }
      }
    },
    find: {
      value: function find(method, path) {
        var cn = this.trees[method]; // Current node as root
        var search = path;
        var n = 0; // Param count
        var handler = undefined;
        var params = [];

        topLabel: while (true) {
          if (search === "" || search === cn.prefix) {
            handler = cn.handler;
            return [handler, params];
          }

          var pl = cn.prefix.length;
          var l = lcp(search, cn.prefix);

          if (l === pl) {
            search = search.substring(l);
            switch (cn.has) {
              case PNODE:
                cn = cn.edges[0];
                var i = 0;
                l = search.length;
                // `/`
                for (; i < l && search.charCodeAt(i) !== 47; i++) {}

                params[n] = {
                  name: cn.prefix.substring(1),
                  value: search.substring(0, i)
                };
                n++;

                search = search.substring(i);

                if (i === l) {
                  // All params read
                  continue;
                }
                break;
              case ANODE:
                params[n] = {
                  name: cn.prefix.substring(1),
                  value: search.substring(0, i)
                };
                search = ""; // End search
                continue;
            }

            var e = cn.findEdge(search[0]);
            if (!e) {
              // Not found
              return null;
            }
            cn = e;
            continue;
          } else {
            // Not found
            return null;
          }
        }
      }
    }
  });

  return Router;
})();

// Length of longest common prefix
function lcp(a, b) {
  var i = 0;
  var max = a.length;
  var l = b.length;
  if (l < max) {
    max = l;
  }
  for (; i < max && a.charCodeAt(i) === b.charCodeAt(i); i++) {}
  return i;
}

Router.Node = Node;

module.exports = Router;