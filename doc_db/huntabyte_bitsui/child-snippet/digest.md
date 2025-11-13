## Child Snippet

The `child` snippet provides complete control over rendered elements in Bits UI components while maintaining accessibility and functionality.

### When to Use
- Need Svelte features (transitions, animations, actions, scoped styles)
- Custom component integration
- Precise DOM structure control
- Advanced component composition

### Basic Usage

Components like `Accordion.Trigger` render default HTML elements. Override with the `child` snippet:

```svelte
<Accordion.Trigger
  id="my-custom-id"
  data-testid="accordion-trigger"
  onclick={() => console.log("clicked")}
>
  {#snippet child({ props })}
    <button {...props} class="scoped-button">Toggle Item</button>
  {/snippet}
</Accordion.Trigger>
<style>
  .scoped-button {
    background-color: #3182ce;
    color: #fff;
  }
</style>
```

The `props` parameter contains all necessary attributes, event handlers, and ARIA attributes. Spread `{...props}` onto your custom element.

### Floating Components

Floating content components (tooltips, popovers, dropdowns) require a two-level structure:

```svelte
<Popover.Content>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props}>Content</div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

Rules:
- Wrapper element with `{...wrapperProps}` must be unstyled (handles positioning)
- Style the inner content element with `{...props}`
- Use `open` parameter for conditional rendering with transitions
- Applies to: `Combobox.Content`, `DatePicker.Content`, `DateRangePicker.Content`, `DropdownMenu.Content`, `LinkPreview.Content`, `Menubar.Content`, `Popover.Content`, `Select.Content`, `Tooltip.Content`

### With Svelte Features

```svelte
<Dialog.Content>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:scale={{ start: 0.95 }}>
        Dialog content
      </div>
    {/if}
  {/snippet}
</Dialog.Content>
```

### Common Pitfalls
- Missing `{...props}` spread on custom element
- Styling the wrapper element in floating components
- Forgetting two-level structure for floating elements