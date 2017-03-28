import _ from 'lodash'
import http from 'http'
import assert from 'power-assert'
import finalhandler from 'finalhandler'
import request from 'supertest'
import Router, { Node } from '..'
import './node'

function createFunc(name) {
  var a = `(function ${name||''}(){})`
  return eval(a)
}

describe('Router', () => {
  let r, result
  beforeEach(() => {
    r = new Router()
  })

  it('static', () => {
    r.add('GET', '/folders/files/bolt.gif', () => {})
    r.tree.printTree('', true)

    result = r.find('GET', '/folders/files/bolt.gif')
    assert.notEqual(null, result[0])

    result = r.find('GET', '/folders/files/bolt.hash.gif')
    assert.equal(null, result[0])

    result = r.find('GET', '/folders/bolt .gif')
    assert.equal(null, result[0])
  })

  it('catch all', () => {
    r.add('GET', '/static/*', () => {})
    r.tree.printTree('', true)

    result = r.find('GET', '/static/*')
    assert.notEqual(null, result[0])

    result = r.find('GET', '/static/js')
    assert.notEqual(null, result[0])
    assert.deepEqual([{
      name: '*',
      value: 'js'
    }], result[1])
    assert.equal(1, result[1].length)

    result = r.find('GET', '/static/css')
    assert.notEqual(null, result[0])
    assert.deepEqual([{
      name: '*',
      value: 'css'
    }], result[1])
    assert.equal(1, result[1].length)
  })

  it('resource', () => {
    [
      ['/', 'root'],
      ['/geocoder', 'geocoder'],
      ['/geocoder/new', 'newGeocoder'],
      ['/geocoder/notify', 'notifyGeocoder'],
      // ['/geocoder/nnn', 'nnnGeocoder'],
      ['/geocoder/edit', 'editGeocoder'],
      ['/geocoder/edit/email', 'editEmailGeocoder'],
      ['/geocoder/edit/:item', 'editItemGeocoder'],
      ['/geocoder/exchange', 'exchangeGeocoder'],
      ['/geocoder/exchange/email', 'exchangeEmailGeocoder'],
      ['/geocoder/exchange/:item', 'exchangeItemGeocoder'],
      ['/geocoder/:id/echo', 'echoGeocoder'],
      ['/geocoder/:action', 'actionGeocoder'],
      ['/geocoder/*', 'anyGeocoder'],
    ].forEach((i) => {
      r.add('GET', i[0], createFunc(i[1]))
    })
    r.tree.printTree('', true)

    result = r.find('GET', '')
    assert.notEqual(null, result[0])
    assert.equal(0, result[1].length)

    result = r.find('GET', '/')
    assert.notEqual(null, result[0])
    assert.equal('root', result[0].name)
    assert.equal(0, result[1].length)

    result = r.find('GET', '/geocoder/delete')
    assert.notEqual(null, result[0])
    assert.equal('actionGeocoder', result[0].name)
    assert.equal(1, result[1].length)
    assert.equal('action', result[1][0].name)
    assert.equal('delete', result[1][0].value)

    result = r.find('GET', '/geocoder/delete/')
    assert.equal('anyGeocoder', result[0].name)
    assert.equal(1, result[1].length)
    assert.equal('*', result[1][0].name)
    assert.equal('delete/', result[1][0].value)

    result = r.find('GET', '/geocoder/any/action')
    assert.notEqual(null, result[0])
    assert.equal('anyGeocoder', result[0].name)
    assert.equal(1, result[1].length)
    assert.equal('*', result[1][0].name)
    assert.equal('any/action', result[1][0].value)

    result = r.find('GET', '/geocoder/exchange/trekjs')
    assert.notEqual(null, result[0])
    assert.equal('exchangeItemGeocoder', result[0].name)
    assert.equal(1, result[1].length)
    assert.equal('item', result[1][0].name)
    assert.equal('trekjs', result[1][0].value)

    result = r.find('GET', '/geocoder/exchange/trekjs/')
    assert.equal('anyGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/exchange/email')
    assert.notEqual(null, result[0])
    assert.equal('exchangeEmailGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/exchange/email/')
    assert.equal('anyGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/exchange')
    assert.notEqual(null, result[0])
    assert.equal('exchangeGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/exchange/')
    assert.equal('anyGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/edit/trekjs')
    assert.notEqual(null, result[0])
    assert.equal('editItemGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/edit/email')
    assert.notEqual(null, result[0])
    assert.equal('editEmailGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/edit/email/')
    assert.equal('anyGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/edit')
    assert.notEqual(null, result[0])
    assert.equal('editGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/edit/')
    assert.equal('anyGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/new')
    assert.notEqual(null, result[0])
    assert.equal('newGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/nnn')
    assert.notEqual(null, result[0])
    assert.equal('actionGeocoder', result[0].name)

    result = r.find('GET', '/geocoder/new/')
    assert.equal('anyGeocoder', result[0].name)

    result = r.find('GET', '/geocoder')
    assert.notEqual(null, result[0])
    assert.equal('geocoder', result[0].name)

    result = r.find('GET', '/geocoder/')
    assert.equal(null, result[0])

    result = r.find('GET', '/repos')
    assert.equal(null, result[0])
  })

  it('resources', () => {
    [
      ['/users', 'users'],
      ['/users/new', 'newUser'],
      ['/users/nnw', 'newUser'],
      ['/users/:id', 'user'],
      ['/users/:id/edit', 'editUser'],
      ['/users/:id/:hello/:good/:bad/ddd', 'editUser'],
      ['/users/:id/:action', 'actionUser'],
      ['/users/:userId/photos/:id', 'photo'],
      ['/users/:userId/books/:id', 'book'],
      ['/users/*', 'anyUser']
    ].forEach((i) => {
      r.add('GET', i[0], createFunc(i[1]))
    })
    r.tree.printTree('', true)

    result = r.find('GET', '/users/610/books/987/edit')
    assert.notEqual(null, result[0])
    assert.equal('anyUser', result[0].name)
    assert.equal(1, result[1].length)
    assert.equal('*', result[1][0].name)
    assert.equal('610/books/987/edit', result[1][0].value)

    result = r.find('GET', '/users/610/books/987')
    assert.notEqual(null, result[0])
    assert.equal('book', result[0].name)
    assert.equal(2, result[1].length)
    assert.equal('userId', result[1][0].name)
    assert.equal('610', result[1][0].value)
    assert.equal('id', result[1][1].name)
    assert.equal('987', result[1][1].value)

    result = r.find('GET', '/users/610/photos')
    assert.notEqual(null, result[0])
    assert.equal('actionUser', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('610', result[1][0].value)

    result = r.find('GET', '/users/610/photos/1024')
    assert.notEqual(null, result[0])
    assert.equal('photo', result[0].name)
    assert.equal('userId', result[1][0].name)
    assert.equal('610', result[1][0].value)
    assert.equal('id', result[1][1].name)
    assert.equal('1024', result[1][1].value)

    result = r.find('GET', '/users/2323/delete')
    assert.notEqual(null, result[0])
    assert.equal('actionUser', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('2323', result[1][0].value)

    result = r.find('GET', '/users/377/edit')
    assert.notEqual(null, result[0])
    assert.equal('editUser', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/users/233')
    assert.notEqual(null, result[0])
    assert.equal('user', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('233', result[1][0].value)

    result = r.find('GET', '/users/new/preview')
    assert.notEqual(null, result[0])
    assert.equal('actionUser', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('new', result[1][0].value)
    assert.equal('action', result[1][1].name)
    assert.equal('preview', result[1][1].value)

    result = r.find('GET', '/users/news')
    assert.notEqual(null, result[0])
    assert.equal('user', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('news', result[1][0].value)

    result = r.find('GET', '/users/new')
    assert.notEqual(null, result[0])
    assert.equal('newUser', result[0].name)

    result = r.find('GET', '/users')
    assert.notEqual(null, result[0])
    assert.equal('users', result[0].name)

    result = r.find('GET', '/user')
    assert.equal(null, result[0])

    result = r.find('GET', '/users/')
    assert.equal(null, result[0])

    result = r.find('GET', '/repos')
    assert.equal(null, result[0])
  })

  it('multi resources', () => {
    _.shuffle([
      ['/users', 'users'],
      ['/users/new', 'newUser'],
      ['/users/:id', 'user'],
      ['/users/:id/:action', 'actionUser'],
      ['/users/:id/edit', 'editUser'],
      ['/users/:id/change', 'changeUser'],
      ['/users/:id/event', 'eventUser'],
      ['/photos', 'photos'],
      ['/photos/new', 'newPhoto'],
      ['/photos/:id', 'photo'],
      ['/photos/:id/:action', 'actionPhoto'],
      ['/photos/:id/edit', 'editPhoto'],
      ['/photos/:id/change', 'changePhoto'],
      ['/photos/:id/event', 'eventPhoto'],
      ['/books', 'books'],
      ['/books/new', 'newBook'],
      ['/books/:id', 'book'],
      ['/books/:id/:action', 'actionBook'],
      ['/books/:id/edit', 'editBook'],
      ['/books/:id/change', 'changeBook'],
      ['/books/:id/event', 'eventBook'],
    ]).forEach((i) => {
      r.add('GET', i[0], createFunc(i[1]))
    })
    r.tree.printTree('', true)

    result = r.find('GET', '/books/377/change')
    assert.notEqual(null, result[0])
    assert.equal('changeBook', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/books/377/event')
    assert.notEqual(null, result[0])
    assert.equal('eventBook', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/books/377/edit')
    assert.notEqual(null, result[0])
    assert.equal('editBook', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/books/233')
    assert.notEqual(null, result[0])
    assert.equal('book', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('233', result[1][0].value)

    result = r.find('GET', '/books/new')
    assert.equal('newBook', result[0].name)
    assert.notEqual(null, result[0])

    result = r.find('GET', '/books')
    assert.notEqual(null, result[0])
    assert.equal('books', result[0].name)

    result = r.find('GET', '/users/377/change')
    assert.notEqual(null, result[0])
    assert.equal('changeUser', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/users/377/event')
    assert.notEqual(null, result[0])
    assert.equal('eventUser', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/users/377/edit')
    assert.notEqual(null, result[0])
    assert.equal('editUser', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/users/233')
    assert.notEqual(null, result[0])
    assert.equal('user', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('233', result[1][0].value)

    result = r.find('GET', '/users/new')
    assert.equal('newUser', result[0].name)
    assert.notEqual(null, result[0])

    result = r.find('GET', '/users')
    assert.notEqual(null, result[0])
    assert.equal('users', result[0].name)

    result = r.find('GET', '/photos/377/event')
    assert.notEqual(null, result[0])
    assert.equal('eventPhoto', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/photos/377/change')
    assert.notEqual(null, result[0])
    assert.equal('changePhoto', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/photos/377/edit')
    assert.notEqual(null, result[0])
    assert.equal('editPhoto', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/photos/233')
    assert.notEqual(null, result[0])
    assert.equal('photo', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('233', result[1][0].value)

    result = r.find('GET', '/photos/new')
    assert.equal('newPhoto', result[0].name)
    assert.notEqual(null, result[0])

    result = r.find('GET', '/photos')
    assert.notEqual(null, result[0])
    assert.equal('photos', result[0].name)
  })

  it('namespace', () => {
    _.shuffle([
      ['/admin/articles', 'articles'],
      ['/admin/articles/new', 'newArticle'],
      ['/admin/articles/:id', 'article'],
      ['/admin/articles/:id/edit', 'editArticle']
    ]).forEach((i) => {
      r.add('GET', i[0], createFunc(i[1]))
    })
    r.tree.printTree('', true)

    result = r.find('GET', '/admin/articles/377/edit')
    assert.notEqual(null, result[0])
    assert.equal('editArticle', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('377', result[1][0].value)

    result = r.find('GET', '/admin/articles/233')
    assert.notEqual(null, result[0])
    assert.equal('article', result[0].name)
    assert.equal('id', result[1][0].name)
    assert.equal('233', result[1][0].value)

    result = r.find('GET', '/admin/articles/new')
    assert.notEqual(null, result[0])
    assert.equal('newArticle', result[0].name)

    result = r.find('GET', '/admin/articles')
    assert.notEqual(null, result[0])
    assert.equal('articles', result[0].name)
  })

  it('nested resources', () => {
    _.shuffle([
      ['/magazines/:mid/articles', 'articles'],
      ['/magazines/:mid/articles/new', 'newArticle'],
      ['/magazines/:mid/articles/:id', 'article'],
      ['/magazines/:mid/articles/:id/edit', 'editArticle'],
      ['/magazines/:m_id/photos', 'photos'],
      ['/magazines/:m_id/photos/new', 'newPhoto'],
      ['/magazines/:m_id/photos/:id', 'photo'],
      ['/magazines/:m_id/photos/:id/edit', 'editPhoto']
    ]).forEach((i) => {
      r.add('GET', i[0], createFunc(i[1]))
    })
    r.tree.printTree('', true)

    result = r.find('GET', '/magazines/233/articles/377/edit')
    assert.notEqual(null, result[0])
    assert.equal('editArticle', result[0].name)
    assert.equal('mid', result[1][0].name)
    assert.equal('233', result[1][0].value)
    assert.equal('id', result[1][1].name)
    assert.equal('377', result[1][1].value)

    result = r.find('GET', '/magazines/233/articles/377')
    assert.notEqual(null, result[0])
    assert.equal('article', result[0].name)
    assert.equal('mid', result[1][0].name)
    assert.equal('233', result[1][0].value)
    assert.equal('id', result[1][1].name)
    assert.equal('377', result[1][1].value)

    result = r.find('GET', '/magazines/233/articles/new')
    assert.notEqual(null, result[0])
    assert.equal('newArticle', result[0].name)
    assert.equal('mid', result[1][0].name)
    assert.equal('233', result[1][0].value)

    result = r.find('GET', '/magazines/233/articles')
    assert.notEqual(null, result[0])
    assert.equal('articles', result[0].name)
    assert.equal('mid', result[1][0].name)
    assert.equal('233', result[1][0].value)

    result = r.find('GET', '/magazines/233/photos/377/edit')
    assert.notEqual(null, result[0])
    assert.equal('editPhoto', result[0].name)
    assert.equal('m_id', result[1][0].name)
    assert.equal('233', result[1][0].value)
    assert.equal('id', result[1][1].name)
    assert.equal('377', result[1][1].value)

    result = r.find('GET', '/magazines/233/photos/377')
    assert.notEqual(null, result[0])
    assert.equal('photo', result[0].name)
    assert.equal('m_id', result[1][0].name)
    assert.equal('233', result[1][0].value)
    assert.equal('id', result[1][1].name)
    assert.equal('377', result[1][1].value)

    result = r.find('GET', '/magazines/233/photos/new')
    assert.notEqual(null, result[0])
    assert.equal('newPhoto', result[0].name)
    assert.equal('m_id', result[1][0].name)
    assert.equal('233', result[1][0].value)

    result = r.find('GET', '/magazines/233/photos')
    assert.notEqual(null, result[0])
    assert.equal('photos', result[0].name)
    assert.equal('m_id', result[1][0].name)
    assert.equal('233', result[1][0].value)
  })

  describe('Node', () => {
    let node
    beforeEach(() => {
      node = new Node('/users')
    })

    it('create a node', () => {
      assert.equal('/users', node.prefix)
      // `/`
      assert.equal(47, node.label)
    })
  })

  describe('HTTP Methods functions', () => {
    it('#GET()', () => {
      r.add('GET', '/folders/files/bolt.gif', () => {})
      r.tree.printTree('', true)

      result = r.find('GET', '/folders/files/bolt.gif')
      assert.notEqual(null, result[0])

      result = r.find('GET', '/folders/files/bolt.hash.gif')
      assert.equal(null, result[0])

      result = r.find('GET', '/folders/bolt .gif')
      assert.equal(null, result[0])
    })
  })

  describe('HTTP Server', () => {
    it('should be used for http server', (done) => {
      r.add('GET', '/', helloWorld)

      let server = createServer(r)

      request(server)
        .get('/')
        .expect(200, 'hello, world', done)
    })

    it('should return params', (done) => {
      r.add('GET', '/:anyway', sawParams)

      let server = createServer(r)

      request(server)
        .get('/233')
        .expect(200, [{value: 233, name: "anyway"}], done)
    })

  })
})

function createServer(router) {
  return http.createServer(function onRequest(req, res) {
    var result = router.find(req.method, req.url)
    if (result) {
      req.params = result[1]
      return result[0](req, res)
    }
    finalhandler(req, res)
  })
}

function helloWorld(req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello, world')
}

function sawParams(req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(req.params))
}
