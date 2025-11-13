Attach event listeners and actions to `document.body` using `<svelte:body>`. Must be at component top level.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```