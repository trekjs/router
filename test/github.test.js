import _ from 'lodash';
import assert from 'power-assert';
import Router from '../src/Router';
import './node';

let api = require('./fixtures/github-api');
let funcPrefix = 'github-api';

function createFunc(name) {
  var a = `(function ${name||''}(){})`;
  return eval(a);
}

describe('GitHub API', () => {
  let r;

  beforeEach(() => {
    r = new Router();
    _.shuffle(api).forEach((i) => {
      let [method, path] = i;
      r.add(method, path, createFunc(_.camelCase(funcPrefix + path)));
    });

  });

  it('GitHub API routes', () => {
    r.trees['GET'].printTree('', true);
  });

  _.shuffle(api).forEach((i) => {
    let [method, path, realpath] = i;
    it(path, () => {
      let [handler, params] = r.find(method, realpath);
      // console.log(path, realpath, handler, params);
      assert.notEqual(null, handler);
      assert.equal(_.camelCase(funcPrefix + path), handler.name);
      assert.equal((path.match(/\:/g) || []).length, params.length);
    });
  });
});
