## $state Rune

Create reactive state with `$state(value)`. Arrays and plain objects become deeply reactive proxies:

```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = true; // triggers updates
```

**Variants:**
- `$state.raw` — non-reactive, reassign-only
- `$state.snapshot` — get plain object from proxy
- `$state.eager` — force immediate updates in await expressions

**Classes:** Use `$state` on class fields, not the class itself.

**Exporting:** Can't directly export reassigned state. Export an object and mutate properties, or use accessor functions instead.