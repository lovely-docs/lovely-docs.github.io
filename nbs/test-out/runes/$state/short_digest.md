## $state

Create reactive state with `$state(value)`. Arrays and plain objects become deeply reactive proxies:

```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = true; // triggers reactivity
```

Use `$state.raw` for non-reactive objects (reassign only, don't mutate). Use `$state.snapshot` to convert proxies to plain objects.

In classes, declare fields with `$state`:

```js
class Todo {
	done = $state(false);
	reset = () => { this.done = false; }
}
```

When exporting state across modules, export objects and mutate their properties, not the state variable itself:

```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```