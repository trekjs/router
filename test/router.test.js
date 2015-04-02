import assert from 'assert';
import Router, { Node } from '../src/router';

describe('Router', () => {
  let r;
  beforeEach(() => {
    r = new Router();
  });

  it('static', () => {
    r.add('get', '/folders/files/bolt.gif', () => {})
    let [h, params] = r.find('get', '/folders/files/bolt.gif');
    assert.notEqual(null, h);
    let result = r.find('get', '/folders/files/bolt.hash.gif');
    assert.equal(null, result);
    let result2 = r.find('get', '/folders/bolt .gif');
    assert.equal(null, result2);
  });

  it('catch all', () => {
    r.add('get', '/static/*', () => {})
    let [h, params] = r.find('get', '/static/*');
    assert.notEqual(null, h);
    let result = r.find('get', '/static/js');
    assert.notEqual(null, result);
    let result2 = r.find('get', '/static/');
    assert.notEqual(null, result2);
  });

  it('param', () => {
    r.add('get', '/users/:id', () => {})
    let [h, params] = r.find('get', '/users/233');
    assert.notEqual(null, h);
    assert.equal('id', params[0].name);
    assert.equal(233, params[0].value);
    let result = r.find('get', '/users/2');
    assert.notEqual(null, result);
    assert.equal('id', result[1][0].name);
    assert.equal(2, result[1][0].value);
  });

  it('params', () => {
    r.add('get', '/users/:id/photos/:pid', () => {})
    let [h, params] = r.find('get', '/users/233/photos/377');
    assert.notEqual(null, h);
    assert.equal('id', params[0].name);
    assert.equal(233, params[0].value);
    assert.equal('pid', params[1].name);
    assert.equal(377, params[1].value);
  });

  describe('Node', () => {
    let node;
    beforeEach(() => {
      node = new Node('/users');
    });

    it('create a node', () => {
      assert.equal('/users', node.prefix);
      assert.equal('/', node.label);
    });
  });
});
