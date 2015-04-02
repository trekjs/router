# trek-router

A fast HTTP router, inspired by [Echo](https://github.com/labstack/echo)'s Router.

  [![NPM version][npm-img]][npm-url]
  [![Build status][travis-img]][travis-url]
  [![Test coverage][coveralls-img]][coveralls-url]
  [![License][license-img]][license-url]
  [![Dependency status][david-img]][david-url]


## Benchmarks

trek-router vs [path-to-regexp][], see [benchmarks](benchmarks)

```bash
$ node benchmarks
```

## Usage

```js
import Router from 'trek-router';

let r = new Router();
// static route
r.add('get', '/folders/files/bolt.gif', () => {});
// param route
r.add('get', '/users/:id', () => {});
// all star
r.add('get', '/books/*', () => {});

let result = r.find('get', '/users/233')
// => [()=>{}, [{name: id, value: 233}]]

let result = r.find('get', '/photos/233')
// => null
```

## License

  [MIT](LICENSE)

[path-to-regexp]: https://github.com/pillarjs/path-to-regexp

[npm-img]: https://img.shields.io/npm/v/trek-router.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trek-router
[travis-img]: https://img.shields.io/travis/trekjs/trek-router.svg?style=flat-square
[travis-url]: https://travis-ci.org/trekjs/trek-router
[coveralls-img]: https://img.shields.io/coveralls/trekjs/trek-router.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/trekjs/trek-router?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/trekjs/trek-router.svg?style=flat-square
[david-url]: https://david-dm.org/trekjs/trek-router
