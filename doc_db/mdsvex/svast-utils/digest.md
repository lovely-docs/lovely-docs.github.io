## Overview

Utilities for working with svast trees, which have non-standard structures with arrays of child nodes in unusual places. Operations are mutable (not immutable) for performance reasons.

## Installation

```bash
npm i svast-utils
```

## API

### `walk(tree, callback)`

Recursively visits every node in a svast tree.

**Signature:**
```ts
type walk = (tree: Node, cb: walkCallback) => Node;
type walkCallback = (node: Node, parent: Node | undefined) => void | boolean;
```

**Behavior:**
- Returns the same tree object (mutated, not copied)
- Callback receives current node and parent node (undefined at root)
- Return `false` from callback to skip walking children of that node (doesn't halt entire walk)
- No copying occurs; safe to mutate tree during walk, but avoid changing array lengths during iteration
- Uses recursion; very large trees may cause stack overflow

**Example:**
```js
import { walk } from 'svast-utils';

const tree = {
  type: 'root',
  children: [
    { type: 'hello' },
    { type: 'hello' },
    { type: 'somethingelse', children: [...] },
  ]
};

const node_names = [];
walk(tree, (node, parent) => {
  node_names.push(node.type);
  if (node.type === 'somethingelse') return false; // skip children
});
// node_names === ['root', 'hello', 'hello', 'somethingelse']
```

### `cleanPositions(tree)`

Removes all `position` properties from every node in a tree.

**Behavior:**
- Returns the same tree object (mutated, not copied)
- Useful for reducing tree size when positional data is no longer needed

**Example:**
```js
import { cleanPositions } from 'svast-utils';

const tree = {
  type: 'root',
  children: [
    { type: 'hello', position: { start: {...}, end: {...} } },
    { type: 'hello', position: { start: {...}, end: {...} } },
  ],
  position: { start: {...}, end: {...} }
};

const clean_tree = cleanPositions(tree);
// Returns same tree with all position properties removed
```