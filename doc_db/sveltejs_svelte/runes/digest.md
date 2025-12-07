## Runes Overview

Runes are `$`-prefixed compiler keywords (not functions) that control Svelte language behavior. They cannot be imported, assigned to variables, or passed as arguments. Introduced in Svelte 5.

## $state

Creates reactive state. Plain values remain plain; arrays and objects become deeply reactive proxies that recursively proxify nested structures. Modifying nested properties triggers granular updates.

```svelte
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
```

Destructuring breaks reactivity since values are evaluated at destructuring time. Class instances are not proxied; use `$state` on class fields instead. The compiler transforms these into get/set methods on private fields.

**Variants:**
- `$state.raw`: Non-reactive state, only reassignable, not mutable. Improves performance for large objects you don't plan to mutate.
- `$state.snapshot`: Takes a static snapshot of a deeply reactive proxy, useful for passing to external libraries that don't expect proxies.
- `$state.eager`: Updates UI immediately when state changes, even in `await` expressions.

**Pass-by-value semantics:** JavaScript passes values, not references. To get reactive updates when passing state to functions, use functions/getters or proxies with get/set properties.

**Cross-module export:** State can only be exported if not directly reassigned. Either update properties instead of reassigning, or don't directly export state—use getter/setter functions instead.

## $derived

Creates reactive computed state that automatically updates when dependencies change. Expressions must be side-effect free.

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

**$derived.by:** For complex derivations, use a function body:
```js
let total = $derived.by(() => {
	let sum = 0;
	for (const n of numbers) sum += n;
	return sum;
});
```

Dependencies are determined by what is synchronously read inside the derived expression. Derived values can be temporarily reassigned (unless declared with `const`), useful for optimistic UI. Unlike `$state`, derived values are not converted to deeply reactive proxies.

**Destructuring:** Creates reactive properties for each destructured variable:
```js
let { a, b, c } = $derived(stuff());
// equivalent to: let a = $derived(_stuff.a); let b = $derived(_stuff.b); etc.
```

Svelte uses push-pull reactivity: state changes immediately notify dependents (push), but derived values only re-evaluate when read (pull). If a derived's new value is referentially identical to its previous value, downstream updates are skipped.

## $effect

Runs side-effect functions when tracked state changes. Only runs in the browser, not during server-side rendering. Use for side effects like calling third-party libraries, drawing on canvas, or making network requests.

```svelte
let size = $state(50);
let color = $state('#ff3e00');
let canvas;

$effect(() => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

Effects run after component mount and in a microtask after state changes. Re-runs are batched. Effects can return a teardown function that runs before re-run or when component is destroyed.

**Dependency tracking:** `$effect` tracks reactive values (`$state`, `$derived`, `$props`) that are synchronously read in the function body. Asynchronous reads (after `await` or inside `setTimeout`) are not tracked. Effects only re-run when the object itself changes, not when properties inside it change. Dependencies are determined by what was read in the last run, so conditional code affects this.

**Variants:**
- `$effect.pre`: Runs code before DOM updates.
- `$effect.tracking()`: Returns whether code is running inside a tracking context (effect or template).
- `$effect.pending()`: Returns count of pending promises in current boundary.
- `$effect.root()`: Creates a non-tracked scope without auto-cleanup. Useful for nested effects you want to manually control.

**Anti-patterns:** Don't update state inside effects—use `$derived` instead. Don't use effects to link values with circular dependencies—use `$derived` and function bindings instead.

## $props

Receives component inputs (properties) with destructuring, defaults, renaming, rest properties, reactivity, and type safety.

```svelte
<script>
  let { adjective = 'happy', super: trouper = 'lights', ...others } = $props();
</script>
```

Props update reactively when parent changes. Child can temporarily reassign but should not mutate unless the prop is bindable. Type annotations can be added for IDE support and documentation.

**$props.id()** (v5.20.0+): Generates a unique ID per component instance, consistent during hydration. Useful for linking elements:
```svelte
const uid = $props.id();
<label for="{uid}-firstname">First Name:</label>
<input id="{uid}-firstname" type="text" />
```

## $bindable

Marks a component prop as bindable, enabling two-way data flow between parent and child components. Allows the child to communicate changes back to the parent.

```svelte
// Child
let { value = $bindable(), ...props } = $props();
<input bind:value={value} {...props} />

// Parent
let message = $state('hello');
<FancyInput bind:value={message} />
```

Parent components don't have to use `bind:` — they can pass a normal prop if they don't want to listen to child changes.

## $inspect

Development-only rune that logs values whenever they change, similar to `console.log` but reactive. Tracks deep changes in objects and arrays.

```svelte
let count = $state(0);
$inspect(count); // logs when count changes
$inspect(count).with((type, count) => {
	if (type === 'update') debugger;
});
```

**$inspect.trace()** (v5.14+): Traces the surrounding function, printing which reactive state caused an effect or derived to re-run. Must be the first statement in a function body.

`$inspect` is a noop in production builds.

## $host

Provides access to the host element when compiling a component as a custom element. Allows dispatching custom events.

```svelte
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('increment')}>increment</button>
```