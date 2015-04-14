import { format } from 'util';
import { Node } from '../src/router';

function prefix(tail, p, on, off) {
  return format('%s%s', p, tail ? on : off);
}

Node.prototype.printTree = function printTree(pfx, tail) {
  let p = prefix(tail, pfx, '└── ', '├── ');
  console.log(
    '%s%s h=%s edges=%s',
    p,
    this.prefix,
    this.handler ? 'function' : undefined,
    this.edges.length
  );

  let nodes = this.edges;
  let l = nodes.length;
  p = prefix(tail, pfx, '    ', '│   ');
  for (let i = 0; i < l - 1; ++i) {
    nodes[i].printTree(p, false);
  }
  if (l > 0) {
    nodes[l - 1].printTree(p, true);
  }
};
