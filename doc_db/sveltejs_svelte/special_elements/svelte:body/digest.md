The `<svelte:body>` element allows you to attach event listeners to `document.body` and use actions on the body element. This is useful for events like `mouseenter` and `mouseleave` that don't fire on `window`.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

The element may only appear at the top level of your component and must never be inside a block or element.