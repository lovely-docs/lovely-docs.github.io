Tracks state changes with undo/redo. Constructor takes getter and setter. Methods: `undo()`, `redo()`, `clear()`. Properties: `log` (array of snapshots with timestamps), `canUndo`, `canRedo`.

```ts
let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));
count = 1; count = 2;
history.undo(); // count = 1
history.redo(); // count = 2
history.clear();
```