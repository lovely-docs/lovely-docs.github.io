The `<svelte:body>` element attaches event listeners and actions to `document.body`. It captures body-specific events like `mouseenter` and `mouseleave`. Must appear only at the top level of a component.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```