## Collapsible

Expandable/collapsible content with accessibility and transitions.

**Basic structure:**
```svelte
<Collapsible.Root bind:open={isOpen}>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>Content</Collapsible.Content>
</Collapsible.Root>
```

**Transitions with forceMount:**
```svelte
<Collapsible.Content forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade>Content</div>
    {/if}
  {/snippet}
</Collapsible.Content>
```

**Hidden until found (browser search):**
```svelte
<Collapsible.Content hiddenUntilFound>Content</Collapsible.Content>
```

**Key props:** `open` (bindable), `onOpenChange`, `disabled`, `forceMount`, `hiddenUntilFound`