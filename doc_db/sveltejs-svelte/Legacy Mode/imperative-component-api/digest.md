## Creating a Component

Client-side components are JavaScript classes instantiated with options:

```ts
import App from './App.svelte';
const app = new App({
	target: document.body,
	props: { answer: 42 },
	context: new Map(),
	hydrate: false,
	intro: false,
	anchor: null
});
```

- `target`: HTMLElement or ShadowRoot (required)
- `anchor`: child of target to render before
- `props`: object of properties
- `context`: Map of root-level context pairs
- `hydrate`: upgrade existing DOM from server-side rendering (requires `hydratable: true` compiler option)
- `intro`: play transitions on initial render

## Instance Methods

**`$set(props)`** - Programmatically update props (schedules async update):
```ts
component.$set({ answer: 42 });
```

**`$on(event, callback)`** - Listen to component events, returns unsubscribe function:
```ts
const off = component.$on('selected', (event) => {
	console.log(event.detail.selection);
});
off();
```

**`$destroy()`** - Remove component from DOM and trigger onDestroy handlers

## Component Props

If compiled with `accessors: true`, props have getters/setters for synchronous updates:
```ts
console.log(component.count);
component.count += 1;
```

## Server-side Components

Server-side components expose a `render()` method returning `{ head, html, css }`:
```ts
const { head, html, css } = App.render(
	{ answer: 42 },
	{ context: new Map([['key', 'value']]) }
);
```

**Note:** This is the Svelte 3/4 API. Svelte 5+ uses `mount()`, `unmount()`, `$state`, and callback props instead.