# trek-router

A fast HTTP router, inspired by [Echo](https://github.com/labstack/echo)'s Router.


## Benchmarks

See [benchmarks](benchmarks), use [GitHub API Routes][] and [Discourse API Routes][].

**VS**

* [path-to-regexp][]
* [route-recognizer][]
* [route-trie][]
* [routington][]

```console
$ yarn run bench
yarn run v0.22.0
$ node benchmarks

GitHub API, 203 routes:
trek-router x 12,652 ops/sec ±0.86% (91 runs sampled)
memoryUsage: { rss: 69746688,
  heapTotal: 46108672,
  heapUsed: 31815272,
  external: 9284 }
path-to-regexp x 973 ops/sec ±0.21% (95 runs sampled)
memoryUsage: { rss: 87674880,
  heapTotal: 63422464,
  heapUsed: 52531280,
  external: 9284 }
route-recognizer x 795 ops/sec ±1.18% (95 runs sampled)
memoryUsage: { rss: 102465536,
  heapTotal: 77578240,
  heapUsed: 44904632,
  external: 9284 }
route-trie x 2,515 ops/sec ±1.64% (94 runs sampled)
memoryUsage: { rss: 100438016,
  heapTotal: 75481088,
  heapUsed: 31334832,
  external: 9284 }
routington x 1,896 ops/sec ±0.84% (95 runs sampled)
memoryUsage: { rss: 100835328,
  heapTotal: 75993088,
  heapUsed: 24018936,
  external: 9284 }
wayfarer x 2,327 ops/sec ±0.80% (97 runs sampled)
memoryUsage: { rss: 101703680,
  heapTotal: 77041664,
  heapUsed: 20170432,
  external: 9284 }
Fastest is trek-router

Discourse API, 359 routes:
trek-router x 8,665 ops/sec ±0.33% (97 runs sampled)
memoryUsage: { rss: 101941248,
  heapTotal: 77041664,
  heapUsed: 37168328,
  external: 9284 }
path-to-regexp x 115 ops/sec ±0.43% (83 runs sampled)
memoryUsage: { rss: 106766336,
  heapTotal: 81772544,
  heapUsed: 33245496,
  external: 9284 }
route-recognizer x 534 ops/sec ±0.12% (95 runs sampled)
memoryUsage: { rss: 107204608,
  heapTotal: 81772544,
  heapUsed: 43184720,
  external: 9284 }
route-trie x 2,183 ops/sec ±0.49% (96 runs sampled)
memoryUsage: { rss: 106786816,
  heapTotal: 81248256,
  heapUsed: 34731560,
  external: 9284 }
routington x 1,487 ops/sec ±0.53% (95 runs sampled)
memoryUsage: { rss: 107184128,
  heapTotal: 81772544,
  heapUsed: 22843088,
  external: 9284 }
wayfarer x 1,966 ops/sec ±0.37% (96 runs sampled)
memoryUsage: { rss: 107184128,
  heapTotal: 81772544,
  heapUsed: 54756160,
  external: 9284 }
Fastest is trek-router
✨  Done in 65.04s.
```


## Usage

```js
import http from 'http';
import finalhandler from 'finalhandler';
import Router from 'trek-router';

let router = Router()

// static route
router.add('GET', '/folders/files/bolt.gif', () => {});
// param route
router.add('GET', '/users/:id', () => {});
// match-any route
router.add('GET', '/books/*', () => {});

let result = router.find('GET', '/users/233')
// => [handler, params]
// => [()=>{}, [{name: id, value: 233}]]

let params = {}
if (result[0]) {
  result[1].forEach(param => params[param.name] = param.value)
  // => { id: 233 }
}

// Not Found
let result = router.find('GET', '/photos/233')
// => [handler, params]
// => [undefined, []]

let server = http.createServer(function(req, res) {
  let result = router.find(req.method, req.url);
  if (result) {
    req.params = result[1];
    return result[0](req, res);
  }
  finalhandler(req, res);
});

server.listen(3000)
```


## Badges

[![NPM version][npm-img]][npm-url]
[![Build Status](https://travis-ci.org/trekjs/router.svg?branch=master)](https://travis-ci.org/trekjs/router)
[![codecov](https://codecov.io/gh/trekjs/router/branch/master/graph/badge.svg)](https://codecov.io/gh/trekjs/router)
[![Dependency status][david-img]][david-url]
![](https://img.shields.io/badge/license-MIT-blue.svg)


---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)

[path-to-regexp]: https://github.com/pillarjs/path-to-regexp
[route-recognizer]: https://github.com/tildeio/route-recognizer
[route-trie]: https://github.com/zensh/route-trie
[routington]: https://github.com/pillarjs/routington

[GitHub API Routes]: test/fixtures/github-api.js
[Discourse API Routes]: test/fixtures/discourse-api.js

[npm-img]: https://img.shields.io/npm/v/trek-router.svg
[npm-url]: https://npmjs.org/package/trek-router
[david-img]: https://img.shields.io/david/trekjs/router.svg
[david-url]: https://david-dm.org/trekjs/router
