## $state Rune

Create reactive state with `$state(value)`. Arrays and plain objects become deeply reactive proxies:

```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers update
```

Use `$state.raw` for non-reactive state that can only be reassigned. Use `$state.snapshot` to get a plain object from a proxy.

For class fields, use `$state` on individual fields. Destructuring breaks reactivity.

When exporting state across modules, either export an object and mutate its properties, or export functions that access the state instead of exporting the state directly.