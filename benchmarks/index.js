const _ = require('lodash')
const assert = require('assert')
const Benchmark = require('benchmark')
const pathToRegexp = require('path-to-regexp')
const RouteRecognizer = require('route-recognizer')
const RouteTrie = require('route-trie')
const Routington = require('routington')
const Router = require('../')
const api = _.shuffle(require('../test/fixtures/github-api'))
const api0 = require('../test/fixtures/discourse-api')

const suite = new Benchmark.Suite

var routes0 = new Router()
api.forEach(function(i) {
  var method = i[0], path = i[1]
  routes0.add(method, path, function() {})
})
var routes00 = new Router()
api0.forEach(function(i) {
  var method = 'GET', path = i[0]
  routes00.add(method, path, function() {})
})

var routes1 = {}
api.forEach(function(i) {
  var keys = []
  var method = i[0], path = i[1]
  var r = routes1[method] || (routes1[method] = [])
  r.push(pathToRegexp(path, keys))
})
var routes10 = {}
api0.forEach(function(i) {
  var keys = []
  var method = 'GET', path = i[0]
  var r = routes10[method] || (routes10[method] = [])
  r.push(pathToRegexp(path, keys))
})

var routes2 = {}
api.forEach(function(i) {
  var method = i[0], path = i[1]
  var r = routes2[method] || (routes2[method] = new RouteRecognizer())
  r.add([{
    path: path,
    handler: function() {}
  }])
})
var routes20 = {}
api0.forEach(function(i) {
  var method = 'GET', path = i[0]
  var r = routes20[method] || (routes20[method] = new RouteRecognizer())
  r.add([{
    path: path,
    handler: function() {}
  }])
})

var routes3 = {}
api.forEach(function(i) {
  var method = i[0], path = i[1]
  var r = routes3[method] || (routes3[method] = new RouteTrie())
  r.define(path)
})
var routes30 = {}
api0.forEach(function(i) {
  var method = 'GET', path = i[0]
  var r = routes30[method] || (routes30[method] = new RouteTrie())
  r.define(path)
})

var routes4 = {}
api.forEach(function(i) {
  var method = i[0], path = i[1]
  var r = routes4[method] || (routes4[method] = new Routington())
  r.define(path)
})
var routes40 = {}
api0.forEach(function(i) {
  var method = 'GET', path = i[0]
  var r = routes40[method] || (routes40[method] = new Routington())
  r.define(path)
})

console.log('\nGitHub API, %s routes:', api.length)
// add tests
suite
.add('trek-router', function() {
  api.forEach(function(i) {
    var method = i[0], path = i[1], realpath = i[2]
    var result = routes0.find(method, realpath)
    var handler = result[0]
    assert.notEqual(null, handler)
  })
})
.add('path-to-regexp', function() {
  api.forEach(function(i) {
    var method = i[0], path = i[1], realpath = i[2]
    var r = routes1[method]
    var result = r.filter(function(j) {
      return j.exec(realpath)
    })[0]
    assert.notEqual(null, result)
  })
})
.add('route-recognizer', function() {
  api.forEach(function(i) {
    var method = i[0], path = i[1], realpath = i[2]
    var r = routes2[method]
    var result = r.recognize(realpath)
    assert.notEqual(null, result)
  })
})
.add('route-trie', function() {
  api.forEach(function(i) {
    var method = i[0], path = i[1], realpath = i[2]
    var r = routes3[method]
    var result = r.match(realpath)
    assert.notEqual(null, result)
  })
})
.add('routington', function() {
  api.forEach(function(i) {
    var method = i[0], path = i[1], realpath = i[2]
    var r = routes4[method]
    var result = r.match(realpath)
    assert.notEqual(null, result)
  })
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target))
  console.log('memoryUsage:', process.memoryUsage())
})
.on('complete', function() {
  console.log('Fastest is ' + _.pluck(this.filter('fastest'), 'name'))
})
// run async
.run({
  // async: true
})

const suite0 = new Benchmark.Suite

console.log('\nDiscourse API, %s routes:', api0.length)
// add tests
suite0
.add('trek-router', function() {
  api0.forEach(function(i) {
    var method = 'GET', path = i[0], realpath = i[1]
    var result = routes00.find(method, realpath)
    var handler = result[0]
    assert.notEqual(null, handler)
  })
})
.add('path-to-regexp', function() {
  api0.forEach(function(i) {
    var method = 'GET', path = i[0], realpath = i[1]
    var r = routes10[method]
    var result = r.filter(function(j) {
      return j.exec(realpath)
    })[0]
    assert.notEqual(null, result)
  })
})
.add('route-recognizer', function() {
  api0.forEach(function(i) {
    var method = 'GET', path = i[0], realpath = i[1]
    var r = routes20[method]
    var result = r.recognize(realpath)
    assert.notEqual(null, result)
  })
})
.add('route-trie', function() {
  api0.forEach(function(i) {
    var method = 'GET', path = i[0], realpath = i[1]
    var r = routes30[method]
    var result = r.match(realpath)
    assert.notEqual(null, result)
  })
})
.add('routington', function() {
  api0.forEach(function(i) {
    var method = 'GET', path = i[0], realpath = i[1]
    var r = routes40[method]
    var result = r.match(realpath)
    assert.notEqual(null, result)
  })
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target))
  console.log('memoryUsage:', process.memoryUsage())
})
.on('complete', function() {
  console.log('Fastest is ' + _.pluck(this.filter('fastest'), 'name'))
})
.run()
