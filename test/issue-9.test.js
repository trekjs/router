import _ from 'lodash'
import Router, { Node, METHODS } from '..'
import './node'

describe('Issue #9', () => {
  let r, result
  beforeEach(() => {
    r = new Router()
  })

  it('routes', () => {
    r.add('GET', '/:prefix/people/:userId/activities/:collection', () => {})
    r.add('GET', '/:prefix/people/*', () => {})
    r.trees['GET'].printTree('', true)

    let [h0, p0] = r.find('GET', '/xxx/people/377/activities/333')
    console.log(h0)
    console.log(p0)

    let [h1, p1] = r.find('GET', '/xxx/people/377/activities')
    console.log(h1)
    console.log(p1)

  })

})
