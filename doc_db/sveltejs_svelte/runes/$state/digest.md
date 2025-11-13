## Creating Reactive State

The `$state` rune creates reactive state that updates the UI when changed:

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

State is just a regular value (number, object, array) — no special API needed.

## Deep Reactivity

Arrays and plain objects become deeply reactive proxies. Modifying nested properties triggers granular updates:

```js
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
todos.push({ done: false, text: 'eat lunch' }); // new objects are also proxified
```

Destructuring breaks reactivity — the values are evaluated at destructuring time, not dynamically.

## Classes

Class instances are not proxied. Use `$state` on class fields instead:

```js
class Todo {
	done = $state(false);
	constructor(text) {
		this.text = $state(text);
	}
}
```

The compiler transforms these into get/set methods. Be careful with `this` binding in event handlers — use arrow functions or inline functions.

## `$state.raw`

For non-reactive objects/arrays, use `$state.raw`. These can only be reassigned, not mutated:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });
person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // works
```

## `$state.snapshot`

Take a static snapshot of a reactive proxy:

```js
let counter = $state({ count: 0 });
console.log($state.snapshot(counter)); // plain object, not Proxy
```

Useful for passing state to external libraries that don't expect proxies.

## `$state.eager`

Force immediate UI updates for state used in `await` expressions:

```svelte
<a href="/" aria-current={$state.eager(pathname) === '/' ? 'page' : null}>home</a>
```

Use sparingly — only for user feedback.

## Passing State to Functions

JavaScript is pass-by-value. When you pass state to a function, it receives the current value, not a reference:

```js
let a = $state(1);
let b = $state(2);
let total = add(a, b); // receives values 1 and 2
a = 3; // total doesn't update
```

To access current values, use functions/getters or pass reactive objects:

```js
let input = $state({ a: 1, b: 2 });
let total = add(input); // receives proxy, can access current values
```

## Exporting State Across Modules

Cannot directly export reassigned state because the compiler transforms references per-file:

```js
// ❌ Don't do this
export let count = $state(0);
export function increment() { count += 1; }
```

Instead, export an object and mutate its properties, or export accessor functions:

```js
// ✅ Export object
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }

// ✅ Export functions
let count = $state(0);
export function getCount() { return count; }
export function increment() { count += 1; }
```