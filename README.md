# trek-router

A fast HTTP router, inspired by [Echo](https://github.com/labstack/echo)'s Router.

  [![NPM version][npm-img]][npm-url]
  [![Build status][travis-img]][travis-url]
  [![Test coverage][coveralls-img]][coveralls-url]
  [![License][license-img]][license-url]
  [![Dependency status][david-img]][david-url]


## Benchmarks

See [benchmarks](benchmarks), use GitHub API Routes.

**VS**

* [path-to-regexp][]
* [route-recognizer][]
* [route-trie][]
* [routington][]

```bash
$ npm run benchmark

trek-router x 5,236 ops/sec ±0.37% (102 runs sampled)
memoryUsage: { rss: 39653376, heapTotal: 31446272, heapUsed: 12252760 }
path-to-regexp x 434 ops/sec ±3.19% (90 runs sampled)
memoryUsage: { rss: 59383808, heapTotal: 50021120, heapUsed: 19588840 }
route-recognizer x 336 ops/sec ±2.33% (92 runs sampled)
memoryUsage: { rss: 62365696, heapTotal: 53104896, heapUsed: 20683920 }
route-trie x 1,105 ops/sec ±4.55% (86 runs sampled)
memoryUsage: { rss: 64360448, heapTotal: 54136832, heapUsed: 28538568 }
routington x 1,237 ops/sec ±0.54% (100 runs sampled)
memoryUsage: { rss: 67698688, heapTotal: 58252544, heapUsed: 18660040 }
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
// => [null, []]
```

## License

  [MIT](LICENSE)

[path-to-regexp]: https://github.com/pillarjs/path-to-regexp
[route-recognizer]: https://github.com/tildeio/route-recognizer
[route-trie]: https://github.com/zensh/route-trie
[routington]: https://github.com/pillarjs/routington

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
