import assert from 'assert';
import Router, { Node } from '../src/router';

function prefix(tail, p, on, off) {
  if (tail) {
    return `${p}${on}`;
  }
  return `${p}${off}`;
}

Node.prototype.printTree = function printTree(pfx, tail) {
  let p = prefix(tail, pfx, '└── ', '├── ');
  console.log(`%s%s has=%d h=%s edges=%s`, p, this.prefix, this.has, this.handler === null ? null : 'function', this.edges.length);

  let nodes = this.edges;
  let l = nodes.length;
  p = prefix(tail, pfx, '    ', '│   ')
  for (let i = 0; i < l-1; i++) {
    nodes[i].printTree(p, false)
  }
  if (l > 0) {
    nodes[l-1].printTree(p, true)
  }
};

describe('Router', () => {
  let r;
  beforeEach(() => {
    r = new Router();
  });

  it('static', () => {
    r.add('GET', '/folders/files/bolt.gif', () => {})
    let [h, params] = r.find('GET', '/folders/files/bolt.gif');
    assert.notEqual(null, h);
    let result = r.find('GET', '/folders/files/bolt.hash.gif');
    assert.equal(null, result[0]);
    let result2 = r.find('GET', '/folders/bolt .gif');
    assert.equal(null, result2[0]);
  });

  it('catch all', () => {
    r.add('GET', '/static/*', () => {})
    let [h, params] = r.find('GET', '/static/*');
    assert.notEqual(null, h);
    let result = r.find('GET', '/static/js');
    assert.notEqual(null, result[0]);
    let result2 = r.find('GET', '/static/');
    assert.notEqual(null, result2[0]);
  });

  it('param', () => {
    r.add('GET', '/users/:id', () => {})
    let [h, params] = r.find('GET', '/users/233');
    assert.notEqual(null, h);
    assert.equal('id', params[0].name);
    assert.equal(233, params[0].value);
    let result = r.find('GET', '/users/2');
    assert.notEqual(null, result[0]);
    assert.equal('id', result[1][0].name);
    assert.equal(2, result[1][0].value);
  });

  it('params', () => {
    r.add('GET', '/users/:id', () => {})
    r.add('GET', '/users/:id/photos/:pid', () => {})
    let [h, params] = r.find('GET', '/users/233');
    assert.notEqual(null, h);
    assert.equal('id', params[0].name);
    assert.equal(233, params[0].value);
    let [h2, params2] = r.find('GET', '/users/233/photos/377');
    assert.notEqual(null, h2);
    assert.equal('id', params2[0].name);
    assert.equal(233, params2[0].value);
    assert.equal('pid', params2[1].name);
    assert.equal(377, params2[1].value);
    r.trees['GET'].printTree('', true)
  });

  /*
  it('params nested resources', () => {
    r.add('GET', '/users/:id', () => {})
    r.add('GET', '/users/:userId/photos/:photoId', () => {})
    console.log(r.trees['GET'].edges[0])
    let [h, params] = r.find('GET', '/users/233');
    assert.notEqual(null, h);
    assert.equal('id', params[0].name);
    assert.equal(233, params[0].value);
    console.log(2333);
    let [h2, params2] = r.find('GET', '/users/233/photos/377');
    assert.notEqual(null, h2);
    assert.equal('userId', params2[0].name);
    assert.equal(233, params2[0].value);
    assert.equal('photoId', params2[1].name);
    assert.equal(377, params2[1].value);
  });

  it('params resource', () => {
    r.add('GET', '/users', () => {})
    r.add('GET', '/users/new', () => {})
    r.add('GET', '/users/:id', () => {})
    let [h, params] = r.find('GET', '/users/233');
    console.log(h)
    assert.notEqual(null, h);
    assert.equal('id', params[0].name);
    assert.equal(233, params[0].value);
    let [h2, params2] = r.find('GET', '/users');
    assert.notEqual(null, h2);
    let [h3, params3] = r.find('GET', '/users/new');
    assert.notEqual(null, h3);
  });
  */

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
