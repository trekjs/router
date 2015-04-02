# trek-router

A fast HTTP router, inspired by [Echo](https://github.com/labstack/echo)'s Router.

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
