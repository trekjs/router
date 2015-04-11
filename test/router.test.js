import _ from 'lodash';
import assert from 'assert';
import { format } from 'util';
import Router, { Node } from '../src/router';

function createFunc(name) {
  var a = `(function ${name||''}(){})`;
  return eval(a);
}

function prefix(tail, p, on, off) {
  if (tail) {
    return format('%s%s', p, on);
  }
  return format('%s%s', p, off);
}

Node.prototype.printTree = function printTree(pfx, tail) {
  let p = prefix(tail, pfx, '└── ', '├── ');
  console.log('%s%s has=%d h=%s edges=%s', p, this.prefix, this.has, this.handler === null ? null : 'function', this.edges.length);

  let nodes = this.edges;
  let l = nodes.length;
  p = prefix(tail, pfx, '    ', '│   ')
  for (let i = 0; i < l - 1; i++) {
    nodes[i].printTree(p, false)
  }
  if (l > 0) {
    nodes[l - 1].printTree(p, true)
  }
};

describe('Router', () => {
  let r, result;
  beforeEach(() => {
    r = new Router();
  });

  it('static', () => {
    r.add('GET', '/folders/files/bolt.gif', () => {})
    r.trees['GET'].printTree('', true)

    result = r.find('GET', '/folders/files/bolt.gif');
    assert.notEqual(null, result[0]);

    result = r.find('GET', '/folders/files/bolt.hash.gif');
    assert.equal(null, result[0]);

    result = r.find('GET', '/folders/bolt .gif');
    assert.equal(null, result[0]);
  });

  it('catch all', () => {
    r.add('GET', '/static/*', () => {})
    r.trees['GET'].printTree('', true)

    result = r.find('GET', '/static/*');
    assert.notEqual(null, result[0]);

    result = r.find('GET', '/static/js');
    assert.notEqual(null, result[0]);
    assert.deepEqual([{
      name: '_name',
      value: 'js'
    }], result[1]);

    result = r.find('GET', '/static/css');
    assert.notEqual(null, result[0]);
    assert.deepEqual([{
      name: '_name',
      value: 'css'
    }], result[1]);
  });

  it('resource', () => {
    [
      ['/geocoder', 'geocoder'],
      ['/geocoder/new', 'newGeocoder'],
      ['/geocoder/edit', 'editGeocoder'],
      ['/geocoder/edit/email', 'editEmailGeocoder'],
      ['/geocoder/edit/:item', 'editItemGeocoder'],
      ['/geocoder/any*', 'anyGeocoder'],
      ['/geocoder/:action', 'actionGeocoder'],
    ].forEach((i) => {
      r.add('GET', i[0], createFunc(i[1]));
    });
    r.trees['GET'].printTree('', true);

    result = r.find('GET', '/geocoder/delete');
    assert.notEqual(null, result[0]);
    assert.equal('actionGeocoder', result[0].name);

    result = r.find('GET', '/geocoder/anyone');
    assert.notEqual(null, result[0]);
    assert.equal('anyGeocoder', result[0].name);

    result = r.find('GET', '/geocoder/edit/trekjs');
    assert.notEqual(null, result[0]);
    assert.equal('editItemGeocoder', result[0].name);

    result = r.find('GET', '/geocoder/edit/email');
    assert.notEqual(null, result[0]);
    assert.equal('editEmailGeocoder', result[0].name);

    result = r.find('GET', '/geocoder/edit');
    assert.notEqual(null, result[0]);
    assert.equal('editGeocoder', result[0].name);

    result = r.find('GET', '/geocoder/new');
    assert.notEqual(null, result[0]);
    assert.equal('newGeocoder', result[0].name);

    result = r.find('GET', '/geocoder');
    assert.notEqual(null, result[0]);
    assert.equal('geocoder', result[0].name);
  });

  it('resources', () => {
    _.shuffle([
      ['/users', 'users'],
      ['/users/new', 'newUser'],
      ['/users/:id', 'user'],
      ['/users/:id/:action', 'actionUser'],
      ['/users/:id/edit', 'editUser'],
      ['/users/:userId/photos/:id', 'photo'],
      ['/users/:userId/books/:id', 'book']
    ]).forEach((i) => {
      r.add('GET', i[0], createFunc(i[1]));
    });
    r.trees['GET'].printTree('', true);

    result = r.find('GET', '/users/610/books/987');
    assert.notEqual(null, result[0]);
    assert.equal('book', result[0].name);
    assert.equal('userId', result[1][0].name);
    assert.equal('610', result[1][0].value);
    assert.equal('id', result[1][1].name);
    assert.equal('987', result[1][1].value);

    result = r.find('GET', '/users/610/photos/1024');
    assert.notEqual(null, result[0]);
    assert.equal('photo', result[0].name);
    assert.equal('userId', result[1][0].name);
    assert.equal('610', result[1][0].value);
    assert.equal('id', result[1][1].name);
    assert.equal('1024', result[1][1].value);

    result = r.find('GET', '/users/2323/delete');
    assert.notEqual(null, result[0]);
    assert.equal('actionUser', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('2323', result[1][0].value);

    result = r.find('GET', '/users/377/edit');
    assert.notEqual(null, result[0]);
    assert.equal('editUser', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/users/233');
    assert.notEqual(null, result[0]);
    assert.equal('user', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('233', result[1][0].value);

    result = r.find('GET', '/users/new');
    assert.notEqual(null, result[0]);
    assert.equal('newUser', result[0].name);

    result = r.find('GET', '/users');
    assert.notEqual(null, result[0]);
    assert.equal('users', result[0].name);
  });

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
      r.add('GET', i[0], createFunc(i[1]));
    });
    r.trees['GET'].printTree('', true);

    result = r.find('GET', '/books/377/change');
    assert.notEqual(null, result[0]);
    assert.equal('changeBook', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/books/377/event');
    assert.notEqual(null, result[0]);
    assert.equal('eventBook', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/books/377/edit');
    assert.notEqual(null, result[0]);
    assert.equal('editBook', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/books/233');
    assert.notEqual(null, result[0]);
    assert.equal('book', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('233', result[1][0].value);

    result = r.find('GET', '/books/new');
    assert.equal('newBook', result[0].name);
    assert.notEqual(null, result[0]);

    result = r.find('GET', '/books');
    assert.notEqual(null, result[0]);
    assert.equal('books', result[0].name);

    result = r.find('GET', '/users/377/change');
    assert.notEqual(null, result[0]);
    assert.equal('changeUser', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/users/377/event');
    assert.notEqual(null, result[0]);
    assert.equal('eventUser', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/users/377/edit');
    assert.notEqual(null, result[0]);
    assert.equal('editUser', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/users/233');
    assert.notEqual(null, result[0]);
    assert.equal('user', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('233', result[1][0].value);

    result = r.find('GET', '/users/new');
    assert.equal('newUser', result[0].name);
    assert.notEqual(null, result[0]);

    result = r.find('GET', '/users');
    assert.notEqual(null, result[0]);
    assert.equal('users', result[0].name);

    result = r.find('GET', '/photos/377/event');
    assert.notEqual(null, result[0]);
    assert.equal('eventPhoto', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/photos/377/change');
    assert.notEqual(null, result[0]);
    assert.equal('changePhoto', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/photos/377/edit');
    assert.notEqual(null, result[0]);
    assert.equal('editPhoto', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/photos/233');
    assert.notEqual(null, result[0]);
    assert.equal('photo', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('233', result[1][0].value);

    result = r.find('GET', '/photos/new');
    assert.equal('newPhoto', result[0].name);
    assert.notEqual(null, result[0]);

    result = r.find('GET', '/photos');
    assert.notEqual(null, result[0]);
    assert.equal('photos', result[0].name);
  });

  it('namespace', () => {
    _.shuffle([
      ['/admin/articles', 'articles'],
      ['/admin/articles/new', 'newArticle'],
      ['/admin/articles/:id', 'article'],
      ['/admin/articles/:id/edit', 'editArticle']
    ]).forEach((i) => {
      r.add('GET', i[0], createFunc(i[1]));
    });
    r.trees['GET'].printTree('', true);

    result = r.find('GET', '/admin/articles/377/edit');
    assert.notEqual(null, result[0]);
    assert.equal('editArticle', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('377', result[1][0].value);

    result = r.find('GET', '/admin/articles/233');
    assert.notEqual(null, result[0]);
    assert.equal('article', result[0].name);
    assert.equal('id', result[1][0].name);
    assert.equal('233', result[1][0].value);

    result = r.find('GET', '/admin/articles/new');
    assert.notEqual(null, result[0]);
    assert.equal('newArticle', result[0].name);

    result = r.find('GET', '/admin/articles');
    assert.notEqual(null, result[0]);
    assert.equal('articles', result[0].name);
  });

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
      r.add('GET', i[0], createFunc(i[1]));
    });
    r.trees['GET'].printTree('', true);

    result = r.find('GET', '/magazines/233/articles/377/edit');
    assert.notEqual(null, result[0]);
    assert.equal('editArticle', result[0].name);
    assert.equal('mid', result[1][0].name);
    assert.equal('233', result[1][0].value);
    assert.equal('id', result[1][1].name);
    assert.equal('377', result[1][1].value);

    result = r.find('GET', '/magazines/233/articles/377');
    assert.notEqual(null, result[0]);
    assert.equal('article', result[0].name);
    assert.equal('mid', result[1][0].name);
    assert.equal('233', result[1][0].value);
    assert.equal('id', result[1][1].name);
    assert.equal('377', result[1][1].value);

    result = r.find('GET', '/magazines/233/articles/new');
    assert.notEqual(null, result[0]);
    assert.equal('newArticle', result[0].name);
    assert.equal('mid', result[1][0].name);
    assert.equal('233', result[1][0].value);

    result = r.find('GET', '/magazines/233/articles');
    assert.notEqual(null, result[0]);
    assert.equal('articles', result[0].name);
    assert.equal('mid', result[1][0].name);
    assert.equal('233', result[1][0].value);

    result = r.find('GET', '/magazines/233/photos/377/edit');
    assert.notEqual(null, result[0]);
    assert.equal('editPhoto', result[0].name);
    assert.equal('m_id', result[1][0].name);
    assert.equal('233', result[1][0].value);
    assert.equal('id', result[1][1].name);
    assert.equal('377', result[1][1].value);

    result = r.find('GET', '/magazines/233/photos/377');
    assert.notEqual(null, result[0]);
    assert.equal('photo', result[0].name);
    assert.equal('m_id', result[1][0].name);
    assert.equal('233', result[1][0].value);
    assert.equal('id', result[1][1].name);
    assert.equal('377', result[1][1].value);

    result = r.find('GET', '/magazines/233/photos/new');
    assert.notEqual(null, result[0]);
    assert.equal('newPhoto', result[0].name);
    assert.equal('m_id', result[1][0].name);
    assert.equal('233', result[1][0].value);

    result = r.find('GET', '/magazines/233/photos');
    assert.notEqual(null, result[0]);
    assert.equal('photos', result[0].name);
    assert.equal('m_id', result[1][0].name);
    assert.equal('233', result[1][0].value);
  });

  describe('Node', () => {
    let node;
    beforeEach(() => {
      node = new Node('/users');
    });

    it('create a node', () => {
      assert.equal('/users', node.prefix);
      // `/`
      assert.equal(47, node.label);
    });
  });

  describe('GitHub API', () => {
    let r;
    let api = require('./github-api');

    beforeEach(() => {
      r = new Router();
      _.shuffle(api).forEach((i) => {
        let [method, path] = i;
        r.add(method, path, createFunc(_.camelCase(path)));
      });

    });

    it('GitHub API routes', () => {
      r.trees['GET'].printTree('', true)
    });

    _.shuffle(api).forEach((i) => {
      let [method, path, realpath] = i;
      it(path, () => {
        let [handler, params] = r.find(method, realpath);
        // console.log(path, realpath, handler, params);
        assert.notEqual(null, handler);
        assert.equal(_.camelCase(path), handler.name);
        assert.equal((path.match(/\:/g) || []).length, params.length);
      });
    });
  });

});
