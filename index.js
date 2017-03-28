/*!
 * router
 * Copyright(c) 2015-2017 Fangdun Cai
 * MIT Licensed
 */

'use strict'

// `*` `/` `:`
const [STAR, SLASH, COLON] = [42, 47, 58]

class Node {

  constructor(prefix = '/', children = [], map = Object.create(null)) {
    this.label = prefix.charCodeAt(0)
    this.prefix = prefix
    this.children = children
    this.map = map
  }

  addChild(n) {
    this.children.push(n)
  }

  findChild(c, l, e, i = 0) {
    for (l = this.children.length; i < l; i++) {
      e = this.children[i]
      // Compare charCode
      if (c === e.label) {
        return e
      }
    }
  }

  addHandler(method, handler, pnames) {
    this.map[method] = {handler, pnames}
  }

  findHandler(method) {
    return this.map[method]
  }

}

class Router {

  constructor() {
    this.tree = new Node()
  }

  add(method, path, handler) {
    // Pnames: Param names
    let [i, l, pnames, ch, j] = [0, path.length, []]

    for (; i < l; ++i) {
      ch = path.charCodeAt(i)
      if (ch === COLON) {
        j = i + 1

        this.insert(method, path.substring(0, i))
        for (; i < l && (path.charCodeAt(i) !== SLASH); ++i) {}

        pnames.push(path.substring(j, i))
        path = path.substring(0, j) + path.substring(i)
        i = j
        l = path.length

        if (i === l) {
          this.insert(method, path.substring(0, i), pnames, handler)
          return
        }
        this.insert(method, path.substring(0, i), pnames)
      } else if (ch === STAR) {
        this.insert(method, path.substring(0, i))
        pnames.push('*')
        this.insert(method, path.substring(0, l), pnames, handler)
        return
      }
    }
    this.insert(method, path, pnames, handler)
  }

  insert(method, path, pnames, handler) {
    // Current node as root
    let [cn, prefix, sl, pl, l, max, n, c] = [this.tree]

    while (true) {
      prefix = cn.prefix
      sl = path.length
      pl = prefix.length
      l = 0

      // LCP
      max = sl < pl ? sl : pl
      for (; l < max && (path.charCodeAt(l) === prefix.charCodeAt(l)); ++l) {}

      /*
      If (l === 0) {
        // At root node
        cn.label = search.charCodeAt(0)
        cn.prefix = search
        if (handler !== undefined) {
          cn.addHandler(method, { pnames, handler })
        }
      } else if (l < pl) {
      */
      if (l < pl) {
        // Split node
        n = new Node(prefix.substring(l), cn.children, cn.map)
        cn.children = [n] // Add to parent

        // Reset parent node
        cn.label = prefix.charCodeAt(0)
        cn.prefix = prefix.substring(0, l)
        cn.map = Object.create(null)

        if (l === sl) {
          // At parent node
          cn.addHandler(method, handler, pnames)
        } else {
          // Create child node
          n = new Node(path.substring(l), [])
          n.addHandler(method, handler, pnames)
          cn.addChild(n)
        }
      } else if (l < sl) {
        path = path.substring(l)
        c = cn.findChild(path.charCodeAt(0))
        if (c !== undefined) {
          // Go deeper
          cn = c
          continue
        }
        // Create child node
        n = new Node(path, [])
        n.addHandler(method, handler, pnames)
        cn.addChild(n)
      } else if (handler !== undefined) {
        // Node already exists
        cn.addHandler(method, handler, pnames)
      }
      return
    }
  }

  find(method, path, cn, n, result) {
    cn = cn || this.tree // Current node as root
    n |= 0 // Param counter
    result = result || [undefined, []]
    let search = path
    let prefix = cn.prefix
    const pvalues = result[1] // Params
    let i, pl, sl, l, max, c
    let preSearch // Pre search

    // Search order static > param > match-any
    if (search.length === 0 || search === prefix) {
      // Found
      const r = cn.findHandler(method)
      if ((result[0] = r && r.handler) !== undefined) {
        const pnames = r.pnames
        if (pnames !== undefined) {
          for (i = 0, l = pnames.length; i < l; ++i) {
            pvalues[i] = {
              name: pnames[i],
              value: pvalues[i]
            }
          }
        }
      }
      return result
    }

    sl = search.length
    pl = prefix.length
    l = 0

    // LCP
    max = sl < pl ? sl : pl
    for (; l < max && (search.charCodeAt(l) === prefix.charCodeAt(l)); ++l) {}

    if (l === pl) {
      search = search.substring(l)
    }
    preSearch = search

    // Static node
    c = cn.findChild(search.charCodeAt(0))
    if (c !== undefined) {
      this.find(method, search, c, n, result)
      if (result[0] !== undefined) {
        return result
      }
      search = preSearch
    }

    // Not found node
    if (l !== pl) {
      return result
    }

    // Param node
    c = cn.findChild(COLON)
    if (c !== undefined) {
      l = search.length
      for (i = 0; i < l && (search.charCodeAt(i) !== SLASH); ++i) {}

      pvalues[n] = search.substring(0, i)

      n++
      preSearch = search
      search = search.substring(i)

      this.find(method, search, c, n, result)
      if (result[0] !== undefined) {
        return result
      }

      n--
      pvalues.pop()
      search = preSearch
    }

    // Any node
    c = cn.findChild(STAR)
    if (c !== undefined) {
      pvalues[n] = search
      search = '' // End search
      this.find(method, search, c, n, result)
    }

    return result
  }

}

Router.Node = Node

module.exports = Router
