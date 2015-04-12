var _ = require('lodash');
var assert = require('assert');
var Benchmark = require('benchmark');
var pathToRegexp = require('path-to-regexp');
var RouteRecognizer = require('route-recognizer');
var RouteTrie = require('route-trie');
var Routington = require('routington');
var Router = require('../');
var api = _.shuffle(require('../test/fixtures/github-api'));

var suite = new Benchmark.Suite;

var routes0 = new Router();
api.forEach(function(i) {
  var method = i[0],
    path = i[1];
  routes0.add(method, path, function() {});
});

var routes1 = {};
api.forEach(function(i) {
  var keys = [];
  var method = i[0],
    path = i[1];
  var r = routes1[method] || (routes1[method] = []);
  r.push(pathToRegexp(path, keys));
});

var routes2 = {};
api.forEach(function(i) {
  var method = i[0],
    path = i[1];
  var r = routes2[method] || (routes2[method] = new RouteRecognizer());
  r.add([{
    path: path,
    handler: function() {}
  }]);
});

var routes3 = {};
api.forEach(function(i) {
  var method = i[0],
    path = i[1];
  var r = routes3[method] || (routes3[method] = new RouteTrie());
  r.define(path);
});

var routes4 = {};
api.forEach(function(i) {
  var method = i[0],
    path = i[1];
  var r = routes4[method] || (routes4[method] = new Routington());
  r.define(path);
});

// add tests
suite
  .add('trek-router', function() {
    api.forEach(function(i) {
      var method = i[0],
        path = i[1],
        realpath = i[2];
      var result = routes0.find(method, realpath);
      var handler = result[0];
      assert.notEqual(null, handler);
    });
  })
  .add('path-to-regexp', function() {
    api.forEach(function(i) {
      var method = i[0],
        path = i[1],
        realpath = i[2];
      var r = routes1[method];
      var result = r.filter(function(j) {
        return j.exec(realpath);
      })[0];
      assert.notEqual(null, result);
    });
  })
  .add('route-recognizer', function() {
    api.forEach(function(i) {
      var method = i[0],
        path = i[1],
        realpath = i[2];
      var r = routes2[method];
      var result = r.recognize(realpath);
      assert.notEqual(null, result);
    });
  })
  .add('route-trie', function() {
    api.forEach(function(i) {
      var method = i[0],
        path = i[1],
        realpath = i[2];
      var r = routes3[method];
      var result = r.match(realpath);
      assert.notEqual(null, result);
    });
  })
  .add('routington', function() {
    api.forEach(function(i) {
      var method = i[0],
        path = i[1],
        realpath = i[2];
      var r = routes4[method];
      var result = r.match(realpath);
      assert.notEqual(null, result);
    });
  })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
    console.log('memoryUsage:', process.memoryUsage());
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  })
  // run async
  .run({
    async: true
  });
