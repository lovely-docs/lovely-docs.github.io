The `<svelte:body>` element allows you to attach event listeners to `document.body` and use actions on the body element.

**Usage:**
```svelte
<svelte:body onevent={handler} />
```

**Key points:**
- Use it to listen to events that don't fire on `window`, such as `mouseenter` and `mouseleave`
- Supports actions via the `use:` directive
- Must appear only at the top level of your component, never inside blocks or elements

**Example:**
```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```