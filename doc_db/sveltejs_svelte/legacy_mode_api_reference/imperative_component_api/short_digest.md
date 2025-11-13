## Creating Components

```ts
const app = new App({
	target: document.body,
	props: { answer: 42 },
	hydrate: false,
	intro: false
});
```

## Instance Methods

- `$set(props)` - Update props (async)
- `$on(event, callback)` - Listen to events
- `$destroy()` - Remove component

## Props with Accessors

With `accessors: true`, props are synchronous getters/setters:
```ts
component.count += 1;
```

## Server-side Rendering

```ts
const { head, html, css } = App.render({ answer: 42 });
```

**Note:** Svelte 3/4 API. Svelte 5 uses `mount()`, `$state`, and callback props.