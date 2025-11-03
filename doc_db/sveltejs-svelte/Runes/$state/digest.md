## Creating Reactive State

Use `$state(value)` to create reactive state. The value is just a normal variable, updated like any other:

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

## Deep Reactivity with Proxies

Arrays and plain objects become deeply reactive proxies. Modifying nested properties triggers granular updates:

```js
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers update
todos.push({ done: false, text: 'eat lunch' }); // new object is also proxified
```

Destructuring breaks reactivity — destructured values are evaluated once and don't update:

```js
let { done, text } = todos[0];
todos[0].done = !todos[0].done; // doesn't affect the destructured `done`
```

## Class Fields

Class instances aren't proxied. Use `$state` on class fields instead:

```js
class Todo {
	done = $state(false);
	constructor(text) {
		this.text = $state(text);
	}
	reset = () => { // use arrow function to preserve `this`
		this.text = '';
		this.done = false;
	}
}
```

The compiler transforms these into get/set methods on private fields.

## `$state.raw`

For non-reactive state that can only be reassigned (not mutated), use `$state.raw`. Improves performance with large objects/arrays you won't mutate:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });
person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // works
```

## `$state.snapshot`

Take a static snapshot of a reactive proxy for passing to external libraries:

```js
let counter = $state({ count: 0 });
console.log($state.snapshot(counter)); // plain object, not Proxy
```

## Passing State to Functions

State is pass-by-value. When passed to functions, they receive the current value. To access reactive updates, use functions/getters or pass proxy objects:

```js
let input = $state({ a: 1, b: 2 });
let total = add(input); // proxy passed, getter accesses current values
console.log(total.value); // 3
input.a = 3;
console.log(total.value); // 7
```

## Exporting State Across Modules

Can't directly export and reassign state because the compiler transforms each reference. Two options:

1. Export an object and mutate its properties (not the object itself):
```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```

2. Don't export the state directly, export functions that access it:
```js
let count = $state(0);
export function getCount() { return count; }
export function increment() { count += 1; }
```