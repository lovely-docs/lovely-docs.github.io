The `<svelte:body>` element attaches event listeners and actions to `document.body`. Use it for events like `mouseenter` and `mouseleave` that don't fire on `window`. Must be at component top level.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```