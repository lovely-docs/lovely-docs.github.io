## Two-way data binding with `bind:`

The `bind:` directive enables data to flow from child to parent (opposite of normal prop flow). Syntax: `bind:property={expression}` where expression is an lvalue. Can omit expression if it matches property name: `bind:value` is equivalent to `bind:value={value}`.

Svelte creates event listeners that update bound values. Most bindings are two-way (changes affect both element and value), some are readonly.

### Function bindings (Svelte 5.9.0+)

Use `bind:property={get, set}` for validation/transformation:
```svelte
<input bind:value={() => value, (v) => value = v.toLowerCase()} />
```

For readonly bindings, set `get` to `null`:
```svelte
<div bind:clientWidth={null, redraw}></div>
```

### Input bindings

- `bind:value` - binds input value, coerces to number for `type="number"` or `type="range"`. Empty/invalid returns `undefined`. Respects `defaultValue` on form reset (5.6.0+).
- `bind:checked` - checkbox binding. Respects `defaultChecked` on form reset (5.6.0+).
- `bind:indeterminate` - checkbox indeterminate state (independent of checked state)
- `bind:group` - groups radio inputs (mutually exclusive) or checkboxes (populate array). Only works within same component.
- `bind:files` - file input binding returns `FileList`. Use `DataTransfer` to update programmatically.

### Select bindings

`bind:value` on `<select>` binds to selected option's value (any type, not just strings). `<select multiple>` binds to array of selected values. Can omit `value` attribute if it matches text content. Respects `selected` attribute on form reset.

### Media element bindings

`<audio>` and `<video>` support two-way bindings: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`. Readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`. `<video>` adds readonly `videoWidth`, `videoHeight`.

### Other element bindings

- `<img>` - readonly `naturalWidth`, `naturalHeight`
- `<details>` - `bind:open`
- Contenteditable elements - `innerHTML`, `innerText`, `textContent`
- All visible elements - readonly dimension bindings: `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize` (measured with ResizeObserver)

### bind:this

Get DOM node reference: `bind:this={dom_node}`. Value is `undefined` until mounted; read in effects/handlers, not during init. Works on components too for programmatic interaction.

### Component prop binding

Use `bind:property={variable}` on components. Mark props as bindable with `$bindable()` rune. Bindable props can have fallback values that only apply when not bound.