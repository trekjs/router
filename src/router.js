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

const SNODE = 1; // Static node
const PNODE = 2; // Param node
const CNODE = 3; // Catch-all node

class Node {

  constructor(prefix, has, handler, edges) {
    this.label = prefix.charCodeAt(0);
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
      // compare charCode
      if (e.label === c) return e;
    }
    return null;
  }

  find(path, n = 0, params = []) {
    let cn = this;
    let search = path;
    let result = [null, params];

    if (search.length === 0 || search === cn.prefix) {
      result[0] = cn.handler;
      if (cn.handler) {
        cn.handler.alias.forEach((a, i) => {
          params[i].name = a;
        });
      }
      return result;
    }

    let pl = cn.prefix.length;
    let l = lcp(search, cn.prefix);
    if (l === pl) {
      search = search.substring(l);
    }

    for (let i = 0, k = cn.edges.length, e; i < k; i++) {
      e = cn.edges[i];
      let has = e.label === 58 ? PNODE : (e.label === 42 ? CNODE : 0);
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
        for (var j = 0; j < l && (search.charCodeAt(j) !== 47); j++) {}

        params[n] = {
          name: e.prefix.substring(1),
          value: search.substring(0, j)
        };
        n++;
        // console.log(search, search.substring(j))
        search = search.substring(j);
      }

      // console.log(e.label, e.prefix, has)
      let x = cn.findEdge(search.charCodeAt(0));
      if (x) {
        result = x.find(search, n, params);
        if (result[0]) break;
      } else {
        result = e.find(search, n, params);
        // if (result[0]) break;
      }
    }

    return result;
  }

}

class Router {

  constructor() {
    this.trees = Object.create(null);
    METHODS.forEach((m) => {
      this.trees[m.toUpperCase()] = new Node('', null, null, []);
    });
  }

  format(path) {
    let p = path;
    let k = -1;
    let alias = [];
    for (let i = 0, l = path.length; i < l; i++) {
      if (path.charCodeAt(i) === 58) {
        let j = 0;
        k++;
        for (; i < l && (path.charCodeAt(i) !== 47); i++) {
          j++;
        }
        p = p.substring(0, i - j + 1 + (p.length - path.length)) + '$' + k + path.substring(i);
        alias.push(path.substring(i - j + 1, i));
      }
    }
    return [p, alias];
  }

  add(method, path, handler) {
    let [p, alias] = this.format(path);
    if (handler) handler.alias = alias
    path = p;
    for (let i = 0, l = path.length; i < l; i++) {
      // `:`
      if (path.charCodeAt(i) === 58) {
        this.insert(method, path.substring(0, i), null, PNODE);
        // `/`
        for (; i < l && (path.charCodeAt(i) !== 47); i++) {}
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
  }

  insert(method, path, handler, has, bool = false) {
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
      } else if (l < pl) {
        // Split node
        let n = new Node(cn.prefix.substring(l), cn.has, cn.handler, cn.edges);
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
          let n = new Node(search.substring(l), has, handler, null);
          if (bool) cn.edges.unshift(n);
          else cn.edges.push(n);
        }
      } else if (l < sl) {
        search = search.substring(l);
        let e = cn.findEdge(search.charCodeAt(0));
        if (e) {
          // Go deeper
          cn = e;
          continue;
        }
        let n = new Node(search, has, handler, null);
        // cn.edges.push(n);
        if (bool) cn.edges.unshift(n);
        else cn.edges.push(n);
      } else {
        // Node already exists
        if (handler) {
          cn.handler = handler;
        }
      }
      return;
    }
  }

  find(method, path) {
    let cn = this.trees[method];
    return cn.find(path);
  }

}

// Length of longest common prefix
function lcp(a, b) {
  let i = 0;
  let max = Math.min(a.length, b.length);
  for (; i < max && (a.charCodeAt(i) === b.charCodeAt(i)); i++) {}
  return i;
}

Router.Node = Node;

export default Router;
