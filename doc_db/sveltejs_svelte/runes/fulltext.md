

## Pages

### what_are_runes
Runes are $ -prefixed keywords in Svelte that control the compiler and are part of the language syntax.

Runes are `$`-prefixed compiler keywords in Svelte (e.g., `$state('hello')`) that control compilation. Unlike functions, they can't be imported, assigned, or passed as arguments — they're language syntax.

### $state
The $state rune creates reactive state in Svelte; arrays and objects become deeply reactive proxies, with variants for raw non-reactive state, snapshots, and eager updates.

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

### $derived
The $derived rune creates reactive computed values that automatically update when their dependencies change, with support for complex derivations via $derived.by and temporary value overrides.

## $derived

Declare reactive derived state that updates when dependencies change:

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

Use `$derived.by()` for complex derivations with function bodies. Derived values can be temporarily overridden for optimistic UI. Destructuring creates reactive variables for each property. Svelte uses push-pull reactivity: changes notify dependents immediately but derived values only recalculate when read.

### $effect
Effects run side effects when state updates, automatically tracking synchronous dependencies and re-running on changes, with variants for pre-DOM execution, tracking context detection, and manual control.

## $effect

Effects run when state updates for side effects (canvas drawing, network requests, etc). They track synchronously-read reactive values and re-run when dependencies change. Asynchronously-read values are not tracked.

```svelte
$effect(() => {
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

Effects can return teardown functions that run before re-runs or on component destroy.

**Variants**: `$effect.pre` (runs before DOM updates), `$effect.tracking()` (checks if in tracking context), `$effect.pending()` (counts pending promises), `$effect.root()` (manual control).

**Don't use effects for state synchronization** — use `$derived` instead. Avoid multiple effects updating each other; use derived values or function bindings.

### $props
The $props rune receives component inputs with destructuring, defaults, renaming, and type safety support.

## $props rune

Receive component props with destructuring:
```svelte
<script>
	let { adjective = 'happy' } = $props();
</script>
```

Supports renaming (`{ super: trouper }`), rest properties (`...others`), and type annotations. Props update reactively but should not be mutated unless bindable. Use `$props.id()` to generate unique instance IDs for linking elements.

### $bindable
The $bindable rune marks props as bindable, enabling bidirectional data flow and allowing parents to use the bind: directive with child components.

## $bindable Rune

Mark a prop as bindable to allow bidirectional data flow between parent and child:

```svelte
// Child
let { value = $bindable(), ...props } = $props();

// Parent
<Child bind:value={message} />
```

Parents can optionally use `bind:` or pass a normal prop. Supports fallback values: `$bindable('fallback')`

### $inspect
A development-only rune for logging and debugging reactive state changes with automatic re-execution and optional custom handlers.

## $inspect

Development-only debugging rune that logs reactive state changes with stack traces. Re-runs whenever arguments change, tracking nested updates.

```svelte
$inspect(count, message); // logs on change
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect.trace(); // traces which state caused effect to re-run
```

### $host
$host rune provides access to the host element for dispatching custom events in custom element components.

The `$host` rune accesses the host element in custom element components, enabling custom event dispatch:

```svelte
$host().dispatchEvent(new CustomEvent(type))
```

