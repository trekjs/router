import _ from 'lodash'
import assert from 'power-assert'
import Router from '..'
import './node'

function createFunc(name) {
  var a = `(function ${name||''}(){})`
  return eval(a)
}

// https://github.com/labstack/echo/issues/479
const api = [
  ['GET', '/:piyo', '/piyo', 'piyo'],
  ['POST', '/:hoge', '/hoge', 'hoge'],
]

describe('Rest API', () => {
  let r

  beforeEach(() => {
    r = new Router()
    _.shuffle(api).forEach((i) => {
      let [method, path] = i
      r.add(method, path, createFunc(_.camelCase('rest-api' + path + '-' + method)))
    })
  })

  it('Parse API routes', () => {
    r.tree.printTree('', true, 'GET')
    r.tree.printTree('', true, 'POST')
  })

  _.shuffle(api).forEach((i) => {
    let [method, path, realpath, paramName] = i
    it(path, () => {
      let [handler, params] = r.find(method, realpath)
      // console.log(method, path, realpath, handler.name, params)
      assert.notEqual(null, handler)
      assert.equal(_.camelCase('rest-api' + path + '-' + method), handler.name)
      assert.equal((path.match(/\:/g) || []).length, params.length)
      assert.equal(params[0].name, paramName)
    })
  })
})
