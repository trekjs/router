import { format } from 'util'
import { Node } from '..'

function prefix(tail, p, on, off) {
  return format('%s%s', p, tail ? on : off)
}

Node.prototype.printTree = function printTree(pfx, tail, method = 'GET') {
  let map = this.maps[method]
  let p = prefix(tail, pfx, '└── ', '├── ')
  console.log(
    '%s%s h=%s children=%s',
    p,
    this.prefix,
    map && map.handler ? map.handler.name : '',
    this.children.length
  )

  let nodes = this.children
  let l = nodes.length
  p = prefix(tail, pfx, '    ', '│   ')
  for (let i = 0; i < l - 1; ++i) {
    nodes[i].printTree(p, false)
  }
  if (l > 0) {
    nodes[l - 1].printTree(p, true)
  }
}
