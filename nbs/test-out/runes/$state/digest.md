## Creating Reactive State

Use `$state(value)` to create reactive state. The value is just a regular variable, updated normally:

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

## Deep Reactivity with Objects and Arrays

Arrays and plain objects become deeply reactive proxies. Modifying nested properties triggers updates:

```js
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers reactivity
todos.push({ done: false, text: 'eat lunch' }); // new objects are also proxified
```

Destructuring breaks reactivity — destructured values are static:

```js
let { done, text } = todos[0];
todos[0].done = !todos[0].done; // doesn't affect the destructured `done`
```

## Class Fields

Use `$state` in class fields (public or private) or in constructor assignments:

```js
class Todo {
	done = $state(false);
	constructor(text) {
		this.text = $state(text);
	}
}
```

The compiler transforms these into get/set methods. When using class methods in event handlers, preserve `this` context with arrow functions:

```svelte
<button onclick={() => todo.reset()}>reset</button>
```

Or define methods as arrow functions in the class.

## `$state.raw`

For non-reactive objects/arrays, use `$state.raw`. These can only be reassigned, not mutated:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });
person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // works
```

Improves performance for large collections you won't mutate.

## `$state.snapshot`

Convert a reactive proxy to a plain object snapshot:

```js
let counter = $state({ count: 0 });
console.log($state.snapshot(counter)); // { count: ... } not Proxy
```

Useful for passing state to external libraries that don't expect proxies.

## Passing State to Functions

State passed to functions is pass-by-value. To maintain reactivity, use functions/getters or pass objects:

```js
let input = $state({ a: 1, b: 2 });
function add(input) {
	return { get value() { return input.a + input.b; } };
}
let total = add(input);
console.log(total.value); // 3
input.a = 3;
console.log(total.value); // 7
```

## Exporting State Across Modules

Can't export state that's directly reassigned (compiler can't track it in other files):

```js
// ❌ Don't do this
export let count = $state(0);
export function increment() { count += 1; }
```

Instead, export an object and mutate its properties:

```js
// ✅ Do this
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```

Or export accessor functions instead of the state directly.