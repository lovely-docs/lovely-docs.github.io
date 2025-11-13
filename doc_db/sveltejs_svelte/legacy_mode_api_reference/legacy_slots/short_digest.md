## Slots in Legacy Mode

Default slots render slotted content with `<slot>`. Named slots use `slot="name"` attribute and `<slot name="name">`.

Slots can pass data back to parent with props and `let:` directive:

```svelte
<!-- Component -->
<slot item={value} />

<!-- Parent -->
<Component let:item={x}>
  <div>{x}</div>
</Component>
```

Fallback content goes inside `<slot>` tags.