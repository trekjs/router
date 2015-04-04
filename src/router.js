/*!
 * router
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import methods from 'methods';

const SNODE = 0; // static route
const PNODE = 1; // param route
const ANODE = 2; // all star route

class Node {

  constructor(prefix, has, handler, edges) {
    this.label = prefix[0];
    this.prefix = prefix;
    this.has = has;
    this.handler = handler;
    this.edges = edges;
    if (!edges) this.edges = [];
  }

  findEdge(c) {
    let [i, l, e] = [0, this.edges.length, void 0];
    for (; i < l; i++) {
      e = this.edges[i];
      if (e.label === c) return e;
    }
    return null;
  }

}

class Router {

  constructor() {
    this.trees = Object.create(null);
    methods.forEach((m) => {
      this.trees[m.toUpperCase()] = new Node('', null, null, []);
    });
  }

  add(method, path, handler) {
    var i = 0, l = path.length;
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

  insert(method, path, handler, has) {
    let cn = this.trees[method]; // Current node as root
    let search = path;

    while (true) {
      let sl = search.length;
      let pl = cn.prefix.length;
      let l = lcp(search, cn.prefix);

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
        let n = new Node(cn.prefix.substring(l), cn.has, cn.handler, cn.edges);
        cn.edges = [n]; // Add to parent

        // Reset parent node
        cn.label = cn.prefix[0]
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
        let e = cn.findEdge(search[0]);
        if (e) {
          cn = e;
        } else {
          let n = new Node(search, has, handler, null, null);
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
  }

  find(method, path) {
    let cn = this.trees[method]; // Current node as root
    let search = path;
    let n = 0; // Param count
    let handler;
    let params = [];

      while (true) {
        if (search === '' || search === cn.prefix) {
          // Found
          handler = cn.handler;
          return [handler, params];
        }

        let pl = cn.prefix.length;
        let l = lcp(search, cn.prefix);

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
              search = ''; // End search
              continue;
          }

          let e = cn.findEdge(search[0])
          if (!e) {
            // Not found
            return null;
          }
          cn = e;
          continue;
        }
        // Not found
        return null;
      }
  }

}

// Length of longest common prefix
function lcp(a, b) {
  var i = 0;
  let max = a.length;
  let l = b.length;
  if (l < max) {
    max = l;
  }
  for (; i < max && a.charCodeAt(i) === b.charCodeAt(i); i++) {}
  return i;
}

Router.Node = Node;

export default Router;
