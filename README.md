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

```bash
$ npm run benchmark

Router x 2,659 ops/sec ±0.99% (86 runs sampled)
{ rss: 40484864, heapTotal: 27330560, heapUsed: 10963168 }
pathToRegexp x 388 ops/sec ±0.93% (89 runs sampled)
{ rss: 43233280, heapTotal: 30414336, heapUsed: 12261616 }
route-recognizer x 285 ops/sec ±1.20% (82 runs sampled)
{ rss: 45744128, heapTotal: 32478208, heapUsed: 19188888 }
route-trie x 1,131 ops/sec ±1.34% (91 runs sampled)
{ rss: 64806912, heapTotal: 52072960, heapUsed: 23980736 }
Fastest is Router
```

## Usage

```js
import Router from 'trek-router';

let r = new Router();
// static route
r.add('GET', '/folders/files/bolt.gif', () => {});
// param route
r.add('GET', '/users/:id', () => {});
// all star
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

[npm-img]: https://img.shields.io/npm/v/trek-router.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trek-router
[travis-img]: https://img.shields.io/travis/trekjs/router.svg?style=flat-square
[travis-url]: https://travis-ci.org/trekjs/router
[coveralls-img]: https://img.shields.io/coveralls/trekjs/router.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/trekjs/router?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/trekjs/router.svg?style=flat-square
[david-url]: https://david-dm.org/trekjs/router
