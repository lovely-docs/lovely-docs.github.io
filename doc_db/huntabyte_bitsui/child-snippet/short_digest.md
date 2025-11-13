## Child Snippet

Override default element rendering in Bits UI components using the `child` snippet.

**Basic usage:**
```svelte
<Accordion.Trigger id="my-id" onclick={handler}>
  {#snippet child({ props })}
    <button {...props} class="custom">Toggle</button>
  {/snippet}
</Accordion.Trigger>
```

**Floating components** (tooltips, popovers, dropdowns) require two-level structure:
```svelte
<Popover.Content>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fade>Content</div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

Key points:
- Spread `{...props}` onto your custom element
- For floating components: wrapper element unstyled, inner element styled
- Use `open` parameter for conditional rendering with transitions
- Always include `{...props}` spread