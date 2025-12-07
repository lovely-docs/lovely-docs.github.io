## Legacy Slots

Svelte 5 legacy mode uses `<slot>` elements to render content passed to components.

**Named slots**: Use `slot="name"` attribute on parent, `<slot name="name">` on child.

**Fallback content**: Put content inside `<slot>` tags to render when nothing is provided.

**Passing data**: Slots pass values back via props; parent receives with `let:` directive:
```svelte
// Child: <slot item={value} />
// Parent: <Component let:item={x}><div>{x}</div></Component>
```

Named slots expose values similarly: `<div slot="name" let:item>{item}</div>`