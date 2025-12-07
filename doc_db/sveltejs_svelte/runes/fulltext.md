

## Pages

### what-are-runes
Runes are `$`-prefixed Svelte compiler keywords (not functions) that control language behavior; can't be imported, assigned, or passed as arguments; introduced in Svelte 5.

Runes are compiler-controlled symbols in Svelte that use a `$` prefix and look like function calls. They are keywords in the Svelte language, not regular JavaScript functions.

Key characteristics:
- No import needed — built into the language
- Not assignable values — cannot be assigned to variables or passed as function arguments
- Position-sensitive — only valid in certain contexts (compiler validates placement)
- Syntax example: `let message = $state('hello');`

Runes were introduced in Svelte 5 and did not exist in earlier versions.

### $state
$state rune creates reactive state; plain values stay plain, arrays/objects become deep proxies; $state.raw for non-reactive, $state.snapshot for static snapshots, $state.eager for immediate updates; pass-by-value semantics require functions for reactive references; cross-module export requires property updates or getter functions.

## Overview
The `$state` rune creates reactive state that automatically updates the UI when changed. Unlike other frameworks, state is just a regular value (number, object, etc.) that you update normally.

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

## Deep State (Proxies)
Arrays and plain objects become deeply reactive proxies. Svelte recursively proxifies until it encounters non-plain objects (classes, Object.create results). Modifying nested properties triggers granular updates:

```js
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
todos.push({ done: false, text: 'eat lunch' }); // new objects are also proxified
```

Destructuring breaks reactivity since values are evaluated at destructuring time:
```js
let { done, text } = todos[0];
todos[0].done = !todos[0].done; // doesn't update `done`
```

## Classes
Class instances are not proxied. Use `$state` on class fields or in constructor assignments:

```js
class Todo {
	done = $state(false);
	constructor(text) {
		this.text = $state(text);
	}
	reset() {
		this.text = '';
		this.done = false;
	}
}
```

The compiler transforms these into get/set methods on private fields (not enumerable). When using methods in event handlers, `this` context matters:

```svelte
<button onclick={todo.reset}>reset</button> <!-- WRONG: this is the button -->
<button onclick={() => todo.reset()}>reset</button> <!-- CORRECT -->
```

Or use arrow functions in the class:
```js
reset = () => { this.text = ''; this.done = false; }
```

Svelte provides reactive built-in classes (Set, Map, Date, URL) from `svelte/reactivity`.

## `$state.raw`
Non-reactive state that can only be reassigned, not mutated. Improves performance for large objects/arrays you don't plan to mutate:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });
person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // works
```

Raw state can contain reactive state (e.g., raw array of reactive objects).

## `$state.snapshot`
Takes a static snapshot of a deeply reactive proxy, useful for passing to external libraries that don't expect proxies:

```js
let counter = $state({ count: 0 });
console.log($state.snapshot(counter)); // { count: ... } not Proxy
```

## `$state.eager`
Updates UI immediately when state changes, even in `await` expressions. Use sparingly for user feedback:

```svelte
<nav>
	<a href="/" aria-current={$state.eager(pathname) === '/' ? 'page' : null}>home</a>
</nav>
```

## Passing State to Functions
JavaScript is pass-by-value. When you pass state to a function, you pass its current value, not a reference that updates:

```js
function add(a, b) { return a + b; }
let a = $state(1), b = $state(2);
let total = add(a, b); // total = 3, doesn't update when a/b change
```

To get current values, use functions/getters:
```js
function add(getA, getB) { return () => getA() + getB(); }
let total = add(() => a, () => b);
console.log(total()); // 3, then 7 after a=3, b=4
```

Proxies and get/set properties also work:
```js
function add(input) {
	return { get value() { return input.a + input.b; } };
}
let input = $state({ a: 1, b: 2 });
let total = add(input);
console.log(total.value); // 3, then 7 after input changes
```

## Passing State Across Modules
State can only be exported if not directly reassigned. The compiler transforms `$state` references into get/set calls, but this only works within a single file:

```js
// state.svelte.js - WRONG
export let count = $state(0);
export function increment() { count += 1; } // compiler transforms this
```

When imported elsewhere, `count` is an object, not a number. Two solutions:

1. Update properties instead of reassigning:
```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```

2. Don't directly export state:
```js
let count = $state(0);
export function getCount() { return count; }
export function increment() { count += 1; }
```

### $derived
$derived creates reactive computed state from expressions; $derived.by for complex logic; side-effect free; can override temporarily; push-pull reactivity with lazy evaluation; destructuring creates reactive properties.

## $derived

Declares derived (computed) state that automatically updates when dependencies change.

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>{doubled}</button>
<p>{count} doubled is {doubled}</p>
```

Expressions must be side-effect free; state mutations like `count++` are disallowed inside derived expressions. Can be used on class fields.

### $derived.by

For complex derivations, use `$derived.by` with a function:

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) total += n;
		return total;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
```

`$derived(expression)` is equivalent to `$derived.by(() => expression)`.

### Dependencies

Anything read synchronously inside the derived expression is a dependency. When dependencies change, the derived is marked dirty and recalculated on next read. Use `untrack` to exempt state from being treated as a dependency.

### Overriding derived values

Derived values can be temporarily reassigned (unless declared with `const`), useful for optimistic UI:

```svelte
<script>
	let { post, like } = $props();
	let likes = $derived(post.likes);

	async function onclick() {
		likes += 1;
		try {
			await like();
		} catch {
			likes -= 1;
		}
	}
</script>

<button {onclick}>🧡 {likes}</button>
```

### Reactivity differences

Unlike `$state`, `$derived` values are not converted to deeply reactive proxies. They remain as-is, so mutating properties of a derived object affects the underlying source array/object.

### Destructuring

Destructuring with `$derived` makes all resulting variables reactive:

```js
let { a, b, c } = $derived(stuff());
// equivalent to:
let _stuff = $derived(stuff());
let a = $derived(_stuff.a);
let b = $derived(_stuff.b);
let c = $derived(_stuff.c);
```

### Update propagation

Svelte uses push-pull reactivity: state changes immediately notify dependents (push), but derived values only re-evaluate when read (pull). If a derived's new value is referentially identical to its previous value, downstream updates are skipped:

```svelte
<script>
	let count = $state(0);
	let large = $derived(count > 10);
</script>

<button onclick={() => count++}>{large}</button>
```

Button only updates when `large` changes, not when `count` changes.

### $effect
$effect runs side-effect functions when tracked state changes; variants: $effect.pre (before DOM), $effect.tracking (check if tracked), $effect.pending (promise count), $effect.root (manual cleanup); avoid for state sync ($derived instead) or circular updates (use function bindings).

## $effect

Effects are functions that run when state updates. They only run in the browser, not during server-side rendering. Use them for side effects like calling third-party libraries, drawing on canvas, or making network requests.

**Don't update state inside effects** — it causes convoluted code and infinite loops. Use `$derived` instead.

### Basic usage

```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');
	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

Svelte automatically tracks which state/derived values are accessed and re-runs the effect when they change.

### Lifecycle

Effects run after component mount and in a microtask after state changes. Re-runs are batched. Can be used anywhere, not just top-level, as long as called while a parent effect is running.

Effects can return a teardown function that runs before re-run or when component is destroyed:

```svelte
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => clearInterval(interval);
	});
</script>

<h1>{count}</h1>
<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

### Understanding dependencies

`$effect` tracks reactive values (`$state`, `$derived`, `$props`) that are **synchronously** read in the function body (including via function calls). Asynchronous reads (after `await` or inside `setTimeout`) are not tracked.

```ts
$effect(() => {
	context.fillStyle = color; // tracked
	setTimeout(() => {
		context.fillRect(0, 0, size, size); // size not tracked
	}, 0);
});
```

Effects only re-run when the object itself changes, not when properties inside it change:

```svelte
<script>
	let state = $state({ value: 0 });
	let derived = $derived({ value: state.value * 2 });

	$effect(() => {
		state; // runs once, state never reassigned
	});

	$effect(() => {
		state.value; // re-runs when state.value changes
	});

	$effect(() => {
		derived; // re-runs, derived is new object each time
	});
</script>

<button onclick={() => (state.value += 1)}>{state.value}</button>
<p>{state.value} doubled is {derived.value}</p>
```

Dependencies are determined by what was read in the **last run**. Conditional code affects this:

```ts
let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
	if (condition) {
		confetti({ colors: [color] }); // if true: depends on both
	} else {
		confetti(); // if false: only depends on condition
	}
});
```

### $effect.pre

Runs code **before** DOM updates:

```svelte
<script>
	import { tick } from 'svelte';
	let div = $state();
	let messages = $state([]);

	$effect.pre(() => {
		if (!div) return;
		messages.length; // reference to re-run on changes
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div.scrollTo(0, div.scrollHeight);
			});
		}
	});
</script>

<div bind:this={div}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

Works exactly like `$effect` except for timing.

### $effect.tracking()

Advanced rune that returns whether code is running inside a tracking context (effect or template):

```svelte
<script>
	console.log('setup:', $effect.tracking()); // false

	$effect(() => {
		console.log('in effect:', $effect.tracking()); // true
	});
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

Used to implement abstractions that only create listeners if values are being tracked.

### $effect.pending()

Returns count of pending promises in current boundary (not including child boundaries):

```svelte
<button onclick={() => a++}>a++</button>
<button onclick={() => b++}>b++</button>

<p>{a} + {b} = {await add(a, b)}</p>

{#if $effect.pending()}
	<p>pending promises: {$effect.pending()}</p>
{/if}
```

### $effect.root()

Advanced rune that creates a non-tracked scope without auto-cleanup. Useful for nested effects you want to manually control, or creating effects outside component initialization:

```js
const destroy = $effect.root(() => {
	$effect(() => {
		// setup
	});

	return () => {
		// cleanup
	};
});

destroy(); // later
```

### When not to use $effect

**Don't synchronize state with effects.** Instead of:

```svelte
<script>
	let count = $state(0);
	let doubled = $state();

	$effect(() => {
		doubled = count * 2; // bad
	});
</script>
```

Use `$derived`:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

For complex expressions, use `$derived.by`. Deriveds can be directly overridden (as of Svelte 5.25) for optimistic UI.

**Don't use effects to link values.** Instead of effects with circular dependencies:

```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $state(total);

	$effect(() => { left = total - spent; }); // bad
	$effect(() => { spent = total - left; }); // bad
</script>
```

Use `$derived` and function bindings:

```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $derived(total - spent);

	function updateLeft(newLeft) {
		spent = total - newLeft;
	}
</script>

<input bind:value={() => left, updateLeft} max={total} />
```

If you must update `$state` in an effect and hit infinite loops from reading/writing the same state, use `untrack()`.

### $props
$props rune for receiving component inputs with destructuring, defaults, renaming, rest properties, reactivity, and type safety; $props.id() generates unique instance IDs.

The `$props` rune receives component inputs (properties). Basic usage:

```svelte
<script>
  let { adjective } = $props();
</script>
<p>this component is {adjective}</p>
```

**Fallback values**: Destructuring allows default values when props are undefined:
```js
let { adjective = 'happy' } = $props();
```

**Renaming props**: Use destructuring to rename invalid identifiers or keywords:
```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

**Rest props**: Capture remaining props:
```js
let { a, b, c, ...others } = $props();
```

**Updating props**: Props update reactively when parent changes. Child can temporarily reassign but should not mutate unless the prop is bindable. Regular object mutations have no effect. Reactive state proxy mutations work but trigger `ownership_invalid_mutation` warning. Fallback values are not reactive proxies, so mutations don't cause updates.

**Type safety**: Add type annotations for better IDE support and documentation:
```svelte
<script lang="ts">
  interface Props {
    adjective: string;
  }
  let { adjective }: Props = $props();
</script>
```

Or with JSDoc:
```svelte
<script>
  /** @type {{ adjective: string }} */
  let { adjective } = $props();
</script>
```

**`$props.id()`** (v5.20.0+): Generates a unique ID per component instance, consistent during hydration. Useful for linking elements:
```svelte
<script>
  const uid = $props.id();
</script>
<label for="{uid}-firstname">First Name:</label>
<input id="{uid}-firstname" type="text" />
```

### bindable
$bindable() rune enables two-way prop binding between parent and child components, allowing children to mutate state and communicate changes back up.

## $bindable Rune

Marks a component prop as bindable, allowing data to flow bidirectionally between parent and child components. By default, props flow one-way from parent to child, but bindable props enable the child to communicate changes back to the parent.

### Usage

Mark a prop as bindable using the `$bindable()` rune:

```svelte
// FancyInput.svelte
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />

<style>
	input {
		font-family: 'Comic Sans MS';
		color: deeppink;
	}
</style>
```

Parent components can then use the `bind:` directive to bind to the bindable prop:

```svelte
// App.svelte
<script>
	import FancyInput from './FancyInput.svelte';
	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

### Key Points

- Bindable props allow state to flow from child to parent, enabling mutation of state proxies in the child
- Normal props can also be mutated, but Svelte warns against this
- Parent components don't have to use `bind:` — they can pass a normal prop if they don't want to listen to child changes
- Specify a fallback value for when no prop is passed: `let { value = $bindable('fallback'), ...props } = $props();`
- Should be used sparingly and carefully to maintain clear data flow

### $inspect
$inspect: reactive console.log for development; .with() for custom callbacks; .trace() to debug effect/derived re-runs.

## $inspect

A development-only rune that logs values whenever they change, similar to `console.log` but reactive. Tracks deep changes in objects and arrays.

```svelte
let count = $state(0);
let message = $state('hello');
$inspect(count, message); // logs when either changes
```

### $inspect(...).with

Returns a `with` method that accepts a callback instead of using `console.log`. The callback receives `"init"` or `"update"` as the first argument, followed by the inspected values.

```svelte
let count = $state(0);
$inspect(count).with((type, count) => {
	if (type === 'update') {
		debugger; // or console.trace
	}
});
```

### $inspect.trace()

Added in 5.14. Traces the surrounding function in development, printing to console which reactive state caused an effect or derived to re-run. Must be the first statement in a function body.

```svelte
$effect(() => {
	$inspect.trace(); // optional label: $inspect.trace('label')
	doSomeWork();
});
```

**Note:** `$inspect` is a noop in production builds. Stack traces are printed on updates (except in playground).

### $host
$host rune returns the host element in custom element components for dispatching custom events

The `$host` rune provides access to the host element when compiling a component as a custom element. This allows you to dispatch custom events and interact with the host DOM element directly.

**Example:**

```svelte
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('decrement')}>decrement</button>
<button onclick={() => dispatch('increment')}>increment</button>
```

Usage in parent component:

```svelte
<script>
	let count = $state(0);
</script>

<my-stepper
	ondecrement={() => count -= 1}
	onincrement={() => count += 1}
></my-stepper>

<p>count: {count}</p>
```

The `$host()` call returns the host element, enabling custom event dispatching from within the custom element component.

