# trek-router

A fast HTTP router, inspired by [Echo](https://github.com/labstack/echo)'s Router.

  [![NPM version][npm-img]][npm-url]
  [![Build status][travis-img]][travis-url]
  [![Test coverage][coveralls-img]][coveralls-url]
  [![License][license-img]][license-url]
  [![Dependency status][david-img]][david-url]


## Benchmarks

See [benchmarks](benchmarks), use [GitHub API Routes][] and [Discourse API Routes][].

**VS**

* [path-to-regexp][]
* [route-recognizer][]
* [route-trie][]
* [routington][]

```bash
$ npm run benchmark

GitHub API, 203 routes:
trek-router x 4,592 ops/sec ±3.45% (91 runs sampled)
memoryUsage: { rss: 41283584, heapTotal: 32478208, heapUsed: 15547912 }
path-to-regexp x 327 ops/sec ±5.95% (71 runs sampled)
memoryUsage: { rss: 60223488, heapTotal: 50021120, heapUsed: 23526096 }
route-recognizer x 274 ops/sec ±7.98% (76 runs sampled)
memoryUsage: { rss: 62676992, heapTotal: 53104896, heapUsed: 20703720 }
route-trie x 675 ops/sec ±5.15% (58 runs sampled)
memoryUsage: { rss: 63909888, heapTotal: 54136832, heapUsed: 22530784 }
routington x 675 ops/sec ±15.40% (56 runs sampled)
memoryUsage: { rss: 65392640, heapTotal: 55168768, heapUsed: 27596440 }
Fastest is trek-router

Discourse API, 359 routes:
trek-router x 2,566 ops/sec ±4.28% (71 runs sampled)
memoryUsage: { rss: 66920448, heapTotal: 56200704, heapUsed: 23280456 }
path-to-regexp x 44.88 ops/sec ±2.98% (60 runs sampled)
memoryUsage: { rss: 68005888, heapTotal: 58252544, heapUsed: 38887896 }
route-recognizer x 122 ops/sec ±5.24% (60 runs sampled)
memoryUsage: { rss: 70610944, heapTotal: 61336320, heapUsed: 41447384 }
route-trie x 746 ops/sec ±5.59% (68 runs sampled)
memoryUsage: { rss: 72040448, heapTotal: 62368256, heapUsed: 40931128 }
routington x 642 ops/sec ±7.77% (66 runs sampled)
memoryUsage: { rss: 73596928, heapTotal: 63400192, heapUsed: 43505976 }
Fastest is trek-router
```

## Usage

```js
import Router from 'trek-router';

let r = new Router();
// static route
r.add('GET', '/folders/files/bolt.gif', () => {});
// param route
r.add('GET', '/users/:id', () => {});
// catch-all route
r.add('GET', '/books/*', () => {});

let result = r.find('GET', '/users/233')
// => [handler, params]
// => [()=>{}, [{name: id, value: 233}]]

// Not Found
let result = r.find('GET', '/photos/233')
// => [handler, params]
// => [undefined, []]
```

## License

  [MIT](LICENSE)

[path-to-regexp]: https://github.com/pillarjs/path-to-regexp
[route-recognizer]: https://github.com/tildeio/route-recognizer
[route-trie]: https://github.com/zensh/route-trie
[routington]: https://github.com/pillarjs/routington

[GitHub API Routes]: test/fixtures/github-api.js
[Discourse API Routes]: test/fixtures/discourse-api.js

[npm-img]: https://img.shields.io/npm/v/trek-router.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trek-router
[travis-img]: https://img.shields.io/travis/trekjs/router.svg?style=flat-square
[travis-url]: https://travis-ci.org/trekjs/router
[coveralls-img]: https://img.shields.io/coveralls/trekjs/router.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/trekjs/router
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/trekjs/router.svg?style=flat-square
[david-url]: https://david-dm.org/trekjs/router
