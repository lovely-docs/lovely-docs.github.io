## Child Snippet

Override default element rendering in Bits UI components using the `child` snippet for custom elements, Svelte features, and precise DOM control.

**Basic usage:** Pass `child` snippet with `props` parameter, spread `{...props}` onto custom element:
```svelte
<Accordion.Trigger>
  {#snippet child({ props })}
    <button {...props}>Custom trigger</button>
  {/snippet}
</Accordion.Trigger>
```

**Floating components** (tooltips, popovers, etc.) require two-level structure with `wrapperProps` (unstyled, handles positioning) and `props` (styled content):
```svelte
<Tooltip.Content>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fade>Content</div>
      </div>
    {/if}
  {/snippet}
</Tooltip.Content>
```

**Key points:** Always spread `{...props}`, custom attributes/handlers merge into props, don't style wrapper in floating components, use `open` for conditional rendering.