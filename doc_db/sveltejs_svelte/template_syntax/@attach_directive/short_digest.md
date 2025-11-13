`{@attach}` runs functions when elements mount or reactive state updates, with optional cleanup. Supports factories, inline definitions, component spreading, and provides utilities for programmatic creation and action conversion.

```svelte
function tooltip(content) {
  return (element) => {
    const tooltip = tippy(element, { content });
    return tooltip.destroy;
  };
}

<button {@attach tooltip(content)}>Hover me</button>
```