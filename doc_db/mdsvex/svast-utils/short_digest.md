## svast-utils

Two utility functions for working with svast trees:

**`walk(tree, callback)`** - Recursively visit every node. Callback receives node and parent; return `false` to skip children. Returns same (mutated) tree.

**`cleanPositions(tree)`** - Remove all `position` properties from nodes to reduce tree size. Returns same (mutated) tree.

Both are mutable operations for performance. `walk` uses recursion so very large trees may overflow the stack.