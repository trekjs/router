import _ from 'lodash'
import assert from 'power-assert'
import api from './fixtures/discourse-api'
import Router from '..'
import './node'

const funcPrefx = 'discourse-api'

function createFunc(name) {
  var a = `(function ${name||''}(){})`
  return eval(a)
}

describe('Discourse API', () => {
  let r

  beforeEach(() => {
    r = new Router()
    _.shuffle(api).forEach((i) => {
      let [path] = i
      r.add('GET', path, createFunc(_.camelCase(funcPrefx + path)))
    })

  })

  it('Discourse API routes', () => {
    r.tree.printTree('', true)
  })

  _.shuffle(api).forEach((i) => {
    let [path, realpath] = i
    it(path, () => {
      let [handler, params] = r.find('GET', realpath)
      // console.log(path, realpath, handler, params)
      assert.notEqual(null, handler)
      assert.equal(_.camelCase(funcPrefx + path), handler.name)
      assert.equal((path.match(/\:|\*/g) || []).length, params.length)
    })
  })
})
