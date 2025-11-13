## Bits UI Documentation

Headless Svelte component library with 40+ accessible, composable components. Unstyled by default—apply styles via `class` prop or data attributes.

**State Management**: `bind:value` for simple binding or function binding with custom getter/setter logic.

**Styling**: Data attributes (`[data-state="open"]`), CSS variables (`--bits-accordion-content-height`), or `class` prop.

**Child Snippet**: Override rendered elements while preserving accessibility:
```svelte
<Accordion.Trigger>
  {#snippet child({ props })}
    <button {...props}>Custom</button>
  {/snippet}
</Accordion.Trigger>
```

**Transitions**: Use `forceMount` with `child` snippet for Svelte transitions.

**Ref Binding**: Access HTML elements via `bind:ref={triggerRef}`.

**DateValue**: Immutable objects from `@internationalized/date`; update via methods: `date = date.add({ days: 1 })`.

**Utilities**: BitsConfig (global defaults), IsUsingKeyboard, mergeProps, Portal, useId.

**Type Helpers**: WithElementRef, WithoutChild, WithoutChildren, WithoutChildrenOrChild.

**v0→v1 Migration**: `el`→`ref`, `asChild`→`child` snippet, component-specific prop changes (e.g., `multiple`→`type`).