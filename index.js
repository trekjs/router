/*!
 * router
 * Copyright(c) 2015-2016 Fangdun Cai
 * MIT Licensed
 */

'use strict'

const METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'HEAD',
  'PATCH',
  'OPTIONS',
  'TRACE'
]

const STAR  = 42 // '*'
const SLASH = 47 // '/'
const COLON = 58 // ':'

/**
 * Route Node
 *
 * @class Node
 * @constructor
 * @param {String} path
 * @param {Array} [children]
 * @param {Function} handler
 * @param {Array} [pnames]
 */
class Node {

  constructor (prefix = '/', children, handlers, pnames) {
    this.label = prefix.charCodeAt(0)
    this.prefix = prefix
    this.children = children || []
    this.handlers = handlers || Object.create(null)
    this.pnames = pnames
  }

  /**
   * Find child node by charCode
   *
   * @param {Number} char code
   * @return {Node|undefined} node
   */
  findChild (c) {
    const l = this.children.length
    let i = 0
    let e
    for (; i < l; ++i) {
      e = this.children[i]
      // Compare charCode
      if (e.label === c) return e
    }
    return
  }

  addHandler (method, handler) {
    this.handlers[method] = handler
  }

  findHandler (method) {
    return this.handlers[method]
  }

}

/**
 * Router
 *
 * @class Router
 * @constructor
 */
class Router {

  constructor () {
    this.tree = new Node()
    METHODS.forEach(M => {
      Object.defineProperty(this, M.toLowerCase(), {
        value: function verb (path, handler) {
          return this.add(M, path, handler)
        }
      })
    })
  }

  /**
   * Add new route
   *
   * @method add
   * @param {String} method
   * @param {String} path
   * @param {Function} handler
   */
  add (method, path, handler) {
    let i = 0
    let l = path.length
    let pnames = [] // Param names
    let ch, j

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
          this.insert(method, path.substring(0, i), handler, pnames)
          return
        }
        this.insert(method, path.substring(0, i))
      } else if (ch === STAR) {
        this.insert(method, path.substring(0, i))
        this.insert(method, path.substring(0, l), handler, pnames)
        return
      }
    }
    this.insert(method, path, handler, pnames)
  }

  /**
   * Insert new route
   *
   * @method insert
   * @private
   * @param {String} method
   * @param {String} path
   * @param {Function} [handler]
   * @param {Array} [pnames]
   */
  insert (method, path, handler, pnames) {
    let cn = this.tree // Current node as root
    let search = path
    let sl, pl, l, max, n, c

    while (true) {
      sl = search.length
      pl = cn.prefix.length
      l = 0

      // LCP
      max = pl
      if (sl < max) {
        max = sl
      }
      for (; l < max && (search.charCodeAt(l) === cn.prefix.charCodeAt(l)); l++) {}

      if (l === 0) {
        // At root node
        cn.label = search.charCodeAt(0)
        cn.prefix = search
        if (handler !== undefined) {
          // cn.handler = handler
          cn.pnames = pnames
          cn.addHandler(method, handler)
        }
      } else if (l < pl) {
      // if (l < pl) {
        // Split node
        n = new Node(cn.prefix.substring(l), cn.children, cn.handlers, cn.pnames)
        cn.children = [n] // Add to parent

        // Reset parent node
        cn.label = cn.prefix.charCodeAt(0)
        cn.prefix = cn.prefix.substring(0, l)
        cn.handler = undefined
        cn.pnames = undefined
        cn.handlers = Object.create(null)

        if (l === sl) {
          // At parent node
          // cn.handler = handler
          cn.pnames = pnames
          cn.addHandler(method, handler)
        } else {
          // Create child node
          n = new Node(search.substring(l), [], Object.create(null), pnames)
          n.addHandler(method, handler)
          cn.children.push(n)
        }
      } else if (l < sl) {
        search = search.substring(l)
        c = cn.findChild(search.charCodeAt(0))
        if (c !== undefined) {
          // Go deeper
          cn = c
          continue
        }
        // Create child node
        n = new Node(search, [], Object.create(null), pnames)
        n.addHandler(method, handler)
        cn.children.push(n)
      } else {
        // Node already exists
        if (handler !== undefined) {
          // cn.handler = handler
          cn.pnames = pnames
          cn.addHandler(method, handler)
        }
      }
      return
    }
  }

  /**
   * Find route by method and path
   *
   * @method find
   * @param {String} method
   * @param {String} path
   * @return {Array} result
   * @property {Undefined|Function} result[0]
   * @property {Array} result[1]
   */
  find (method, path, cn, n, result) {
    cn = cn || this.tree // Current node as root
    n = n | 0 // Param count
    result = result || [undefined, []]
    let search = path
    let params = result[1] // Params
    let pl, sl, l, max, c
    let preSearch // Pre search

    // Search order static > param > match-any
    if (search.length === 0 || search === cn.prefix) {
      // Found
      result[0] = cn.findHandler(method)
      if (result[0] !== undefined) {
        let pnames = cn.pnames
        if (pnames !== undefined) {
          let i = 0
          let l = pnames.length
          for (; i < l; ++i) {
            params[i].name = pnames[i]
          }
        }
      }
      return result
    }

    sl = search.length
    pl = cn.prefix.length
    l = 0

    // LCP
    max = pl
    if (sl < max) {
      max = sl
    }
    for (; l < max && (search.charCodeAt(l) === cn.prefix.charCodeAt(l)); l++) {}

    if (l == pl) {
      search = search.substring(l)
    }
    preSearch = search

    // Static node
    c = cn.findChild(search.charCodeAt(0))
    if (c !== undefined) {
      this.find(method, search, c, n, result)
      if (result[0] !== undefined) return result
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
      for (var i = 0; i < l && (search.charCodeAt(i) !== SLASH); ++i) {}

      params[n] = {
        value: search.substring(0, i)
      }

      n++
      preSearch = search
      search = search.substring(i)

      this.find(method, search, c, n, result)
      if (result[0] !== undefined) return result

      n--
      params.pop()
      search = preSearch
    }

    // Match-any node
    c = cn.findChild(STAR)
    if (c !== undefined) {
      params[n] = {
        name: '_*',
        value: search
      }
      search = '' // End search
      this.find(method, search, c, n, result)
    }

    return result
  }

}

Router.METHODS = METHODS

Router.Node = Node

module.exports = Router
