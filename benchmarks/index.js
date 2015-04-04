var assert = require('assert');
var Benchmark = require('benchmark');
var Router = require('../');
var pathToRegexp = require('path-to-regexp');

var suite = new Benchmark.Suite;

// add tests
suite
  .add('Router', function() {
    var r = new Router();
    r.add('GET', '/folders/files/bolt.gif', function() {});
    r.add('GET', '/users/:id', function() {});
    r.add('GET', '/photos/:id', function() {});
    r.add('GET', '/books/:id', function() {});
    r.add('GET', '/repos/:id', function() {});
    r.add('GET', '/replies/:id', function() {});
    r.add('GET', '/notifications/:id', function() {});
    r.add('GET', '/photos/:id/comments/:cid', function() {});
    var result = r.find('GET', '/photos/233');
    assert.notEqual(null, result[0]);
    var result = r.find('GET', '/photos/233/comments/377');
    assert.notEqual(null, result[0]);
  })
  .add('pathToRegexp', function() {
    var r = [];
    var keys = [];
    r.push(pathToRegexp('/folders/files/bolt.gif', keys));
    r.push(pathToRegexp('/users/:id', keys));
    r.push(pathToRegexp('/photos/:id', keys));
    r.push(pathToRegexp('/books/:id', keys));
    r.push(pathToRegexp('/repos/:id', keys));
    r.push(pathToRegexp('/replies/:id', keys));
    r.push(pathToRegexp('/notifications/:id', keys));
    r.push(pathToRegexp('/photos/:id/comments/:cid'), keys);
    var result;
    for (var i = 0, l = r.length; i < l; i++) {
      result = r[i].test('/notifications/233');
      if (result) break;
    }
    assert.notEqual(null, result);
    var result2;
    for (var i = 0, l = r.length; i < l; i++) {
      result2 = r[i].test('/photos/233/comments/377');
      if (result2) break;
    }
    assert.notEqual(null, result2);
  })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
    console.log(process.memoryUsage());
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  })
  // run async
  .run({
    'async': true
  });
