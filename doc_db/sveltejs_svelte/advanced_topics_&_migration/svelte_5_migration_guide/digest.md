## Reactivity Syntax Changes

**`let` → `$state`**: Reactive variables now use the `$state` rune instead of implicit reactivity.
```svelte
let count = $state(0);
```

**`$:` → `$derived`/`$effect`**: Reactive statements split into two runes:
- `$derived` for computed values: `const double = $derived(count * 2);`
- `$effect` for side effects: `$effect(() => { if (count > 5) alert('too high'); })`

**`export let` → `$props`**: Component properties use destructuring with `$props()`:
```svelte
let { optional = 'unset', required, class: klass, ...rest } = $props();
```

## Event Changes

**`on:` directive → event attributes**: Event handlers are now properties without the colon:
```svelte
<button onclick={() => count++}>clicks: {count}</button>
// or with named function
function onclick() { count++; }
<button {onclick}>clicks: {count}</button>
```

**Component events**: Replace `createEventDispatcher` with callback props:
```svelte
// Parent
<Pump inflate={(power) => { size += power; }} />
// Child
let { inflate, deflate } = $props();
<button onclick={() => inflate(power)}>inflate</button>
```

**Event modifiers removed**: Implement manually or use event methods:
```svelte
function once(fn) {
  return function(event) {
    if (fn) fn.call(this, event);
    fn = null;
  };
}
<button onclick={once(preventDefault(handler))}>...</button>
```

**Multiple handlers**: Combine into single handler:
```svelte
<button onclick={(e) => { one(e); two(e); }}>...</button>
```

## Snippets Replace Slots

**Default content**: Use `children` prop with `{@render}`:
```svelte
let { children } = $props();
{@render children?.()}
```

**Named slots**: Use named snippet props:
```svelte
let { header, main, footer } = $props();
<header>{@render header()}</header>
```

**Passing data**: Snippets receive parameters directly:
```svelte
// Parent
{#snippet item(text)}<span>{text}</span>{/snippet}
// Child
let { item } = $props();
{@render item(entry)}
```

## Component Instantiation

Components are now functions, not classes. Use `mount`/`hydrate` from `svelte`:
```svelte
import { mount } from 'svelte';
const app = mount(App, { target: document.getElementById("app") });
```

**Replacing class API**:
- `$on` → pass via `events` option (discouraged, use callbacks instead)
- `$set` → use `$state` object: `const props = $state({ foo: 'bar' }); mount(App, { props }); props.foo = 'baz';`
- `$destroy` → use `unmount(app)`

**Server-side rendering**: Use `render` from `svelte/server`:
```svelte
import { render } from 'svelte/server';
const { html, head } = render(App, { props: { message: 'hello' }});
```

## Other Changes

**`<svelte:component>` no longer needed**: Components are now dynamic by default:
```svelte
let Thing = $state();
<Thing /> <!-- equivalent to <svelte:component this={Thing} /> -->
```

**Dot notation for components**: `<foo.bar>` now creates a component, not an element.

**Whitespace handling simplified**: Whitespace between nodes collapses to one, whitespace at tag start/end removed (except in `pre` tags).

**Modern browser required**: Proxies, ResizeObserver, and other modern APIs required. IE not supported.

**Runes mode breaking changes**:
- Component exports cannot be bound to directly; use `bind:this` instead
- Properties not bindable by default; use `$bindable()` rune
- `accessors` option ignored; use component exports instead
- `immutable` option ignored
- Classes no longer auto-reactive; define fields as `$state`
- Touch/wheel events are passive by default
- Attribute syntax stricter; complex values must be quoted
- HTML structure stricter; browser auto-repair not allowed

**CSS changes**: Scoped CSS now uses `:where()` selector modifier for better specificity control.

**Migration script**: Run `npx sv migrate svelte-5` to automate most migrations. Manual cleanup needed for `createEventDispatcher`, `beforeUpdate`/`afterUpdate`, and some edge cases.