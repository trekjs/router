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

GitHub API, 203 routes:
trek-router x 5,195 ops/sec ±0.52% (97 runs sampled)
memoryUsage: { rss: 42127360, heapTotal: 33510144, heapUsed: 13448096 }
path-to-regexp x 430 ops/sec ±0.40% (97 runs sampled)
memoryUsage: { rss: 60870656, heapTotal: 51053056, heapUsed: 27650000 }
route-recognizer x 338 ops/sec ±0.12% (93 runs sampled)
memoryUsage: { rss: 63836160, heapTotal: 54136832, heapUsed: 33341632 }
route-trie x 1,191 ops/sec ±1.97% (97 runs sampled)
memoryUsage: { rss: 66113536, heapTotal: 55168768, heapUsed: 30571304 }
routington x 1,207 ops/sec ±0.52% (100 runs sampled)
memoryUsage: { rss: 68222976, heapTotal: 59284480, heapUsed: 27390704 }
Fastest is trek-router

Discourse API, 359 routes:
trek-router x 3,497 ops/sec ±3.39% (95 runs sampled)
memoryUsage: { rss: 70569984, heapTotal: 61348352, heapUsed: 36756048 }
path-to-regexp x 51.26 ops/sec ±3.20% (68 runs sampled)
memoryUsage: { rss: 72175616, heapTotal: 62368256, heapUsed: 42414472 }
route-recognizer x 171 ops/sec ±4.88% (76 runs sampled)
memoryUsage: { rss: 74690560, heapTotal: 64432128, heapUsed: 21920328 }
route-trie x 811 ops/sec ±7.56% (78 runs sampled)
memoryUsage: { rss: 74670080, heapTotal: 64432128, heapUsed: 26638880 }
routington x 470 ops/sec ±3.15% (51 runs sampled)
memoryUsage: { rss: 74686464, heapTotal: 64432128, heapUsed: 23663464 }
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
