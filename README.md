# trek-router

A fast HTTP router, inspired by [Echo](https://github.com/labstack/echo)'s Router.

  [![NPM version][npm-img]][npm-url]
  [![Build status][travis-img]][travis-url]
  [![Test coverage][coveralls-img]][coveralls-url]
  [![License][license-img]][license-url]
  [![Dependency status][david-img]][david-url]


## Benchmarks

See [benchmarks](benchmarks), use GitHub API Routes.

**trek-router** VS

* [path-to-regexp][]
* [route-recognizer][]
* [route-trie][]
* [routington][]

```bash
$ npm run benchmark

trek-router x 2,953 ops/sec ±0.82% (86 runs sampled)
memoryUsage: { rss: 41099264, heapTotal: 27330560, heapUsed: 12131640 }
path-to-regexp x 398 ops/sec ±0.91% (84 runs sampled)
memoryUsage: { rss: 44023808, heapTotal: 31446272, heapUsed: 13515744 }
route-recognizer x 280 ops/sec ±1.81% (79 runs sampled)
memoryUsage: { rss: 63115264, heapTotal: 51041024, heapUsed: 18087664 }
route-trie x 1,098 ops/sec ±1.16% (86 runs sampled)
memoryUsage: { rss: 64200704, heapTotal: 51041024, heapUsed: 20905648 }
routington x 1,156 ops/sec ±1.56% (87 runs sampled)
memoryUsage: { rss: 64397312, heapTotal: 51041024, heapUsed: 12043280 }
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
