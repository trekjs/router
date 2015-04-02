var assert = require('assert');
var Benchmark = require('benchmark');
var Router = require('../');
var pathToRegexp = require('path-to-regexp');

var suite = new Benchmark.Suite;

// add tests
suite
  .add('Router', function() {
    var r = new Router();
    r.add('get', '/folders/files/bolt.gif', function() {});
    r.add('get', '/users/:id', function() {});
    r.add('get', '/photos/:id', function() {});
    r.add('get', '/books/:id', function() {});
    r.add('get', '/repos/:id', function() {});
    r.add('get', '/replies/:id', function() {});
    r.add('get', '/notifications/:id', function() {});
    var result = r.find('get', '/notifications/233');
    assert.notEqual(null, result);
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
    var result;
    for (var i = 0, l = r.length; i < l; i++) {
      result = r[i].test('/notifications/233');
      if (result) break;
    }
    assert.notEqual(null, result);
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
