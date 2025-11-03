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

- `$set(props)` - update props (async)
- `$on(event, callback)` - listen to events
- `$destroy()` - cleanup

## Props with Accessors

With `accessors: true`, props are synchronously settable:
```ts
component.count += 1;
```

## Server-side Rendering

```ts
const { head, html, css } = App.render({ answer: 42 });
```

**Note:** Svelte 5+ uses different APIs (`mount`, `unmount`, `$state`).