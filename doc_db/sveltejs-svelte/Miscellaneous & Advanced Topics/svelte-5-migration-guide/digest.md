## Reactivity Syntax Changes

**`let` → `$state`**: Reactive variables now use the `$state` rune instead of implicit reactivity.
```svelte
let count = $state(0);
```

**`$:` → `$derived`/`$effect`**: Reactive statements split into two runes:
- `$derived` for computed values: `const double = $derived(count * 2);`
- `$effect` for side effects: `$effect(() => { if (count > 5) alert('too high'); });`

**`export let` → `$props`**: Component properties use destructuring with `$props()`:
```svelte
let { optional = 'unset', required, class: klass, ...rest } = $props();
```

## Event Changes

**`on:` directive → event attributes**: Event handlers are now properties without the colon:
```svelte
<button onclick={() => count++}>clicks: {count}</button>
```

**`createEventDispatcher` → callback props**: Components accept functions as props instead of emitting events:
```svelte
// Parent
<Pump inflate={(power) => { size += power; }} />

// Child
let { inflate } = $props();
<button onclick={() => inflate(power)}>inflate</button>
```

**Event modifiers removed**: Use explicit code instead. For `capture`, `passive`, `nonpassive` that can't be wrapped, use actions or event name modifiers (`onclickcapture`).

**Multiple handlers**: Combine into one handler instead of duplicating attributes.

## Snippets Replace Slots

**Default content**: Use `children` prop with `{@render children?.()}` instead of `<slot />`.

**Named slots**: Use props with `{@render header()}` instead of `<slot name="header" />`.

**Passing data back**: Snippets replace `let:` syntax:
```svelte
// Parent
{#snippet item(text)}
  <span>{text}</span>
{/snippet}

// Child
let { item } = $props();
{@render item(entry)}
```

## Component Instantiation

Components are now functions, not classes. Use `mount()` or `hydrate()` from `svelte`:
```svelte
import { mount } from 'svelte';
const app = mount(App, { target: document.getElementById("app") });
```

Replace `$set`, `$on`, `$destroy` with:
- `$set`: Use `$state` objects and mutate them
- `$on`: Pass callbacks via `events` option (discouraged; use callback props instead)
- `$destroy`: Use `unmount(app)`

For server-side rendering, use `render()` from `svelte/server` instead of `App.render()`.

## Dynamic Components

`<svelte:component>` is no longer necessary. Components can be dynamic directly:
```svelte
let Thing = $state();
<Thing />
```

Dot notation now indicates components: `<item.component />` instead of creating an element.

## Runes Mode Breaking Changes

**Bindable properties**: Use `$bindable()` rune to allow `bind:` directives:
```svelte
let { foo = $bindable('bar') } = $props();
```

**No binding to exports**: Use `bind:this` instead to access exports.

**`accessors` option ignored**: Use component exports instead.

**Classes not auto-reactive**: Define reactive fields with `$state` on class instances.

**Touch/wheel events are passive**: Handlers for `onwheel`, `ontouchstart`, etc. are passive by default.

## Other Changes

- **Whitespace handling simplified**: Whitespace between nodes collapses to one; start/end whitespace removed (except in `pre` tags)
- **Modern browser required**: IE not supported; uses Proxies, ResizeObserver
- **HTML structure stricter**: Invalid HTML structures cause compiler errors
- **CSS scoping uses `:where()`**: Avoids specificity issues
- **`null`/`undefined` → empty string**: When rendered in templates
- **`bind:files` stricter**: Only accepts `null`, `undefined`, or `FileList`
- **Bindings react to form resets**: Values stay in sync with DOM
- **`mount` plays transitions by default**: Set `intro: false` to disable

## Migration Script

Run `npx sv migrate svelte-5` to automatically migrate most code. Manual cleanup needed for:
- `createEventDispatcher` usage
- `beforeUpdate`/`afterUpdate` (use `$effect.pre` and `$effect`)
- `run` function from `svelte/legacy` (replace with `$effect`)
- Event modifier wrappers from `svelte/legacy`