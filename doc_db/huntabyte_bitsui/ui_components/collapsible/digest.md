## Collapsible Component

Expandable/collapsible content sections with accessibility, transitions, and flexible state management.

### Architecture
- **Root**: Parent container managing state and context
- **Trigger**: Interactive button toggling expanded/collapsed state
- **Content**: Container for shown/hidden content

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open</button>
<Collapsible.Root bind:open={isOpen}>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>Content</Collapsible.Content>
</Collapsible.Root>
```

**Fully controlled with function binding:**
```svelte
<Collapsible.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</Collapsible.Root>
```

### Transitions

Use `forceMount` with `child` snippet for Svelte transitions:
```svelte
<Collapsible.Content forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade>Content</div>
    {/if}
  {/snippet}
</Collapsible.Content>
```

### Hidden Until Found

Enable browser find-in-page integration:
```svelte
<Collapsible.Content hiddenUntilFound>
  Searchable content
</Collapsible.Content>
```

### API Reference

**Collapsible.Root props:**
- `open` ($bindable): boolean, default false
- `onOpenChange`: (open: boolean) => void
- `onOpenChangeComplete`: (open: boolean) => void
- `disabled`: boolean, default false
- `ref` ($bindable): HTMLDivElement

**Collapsible.Trigger props:**
- `ref` ($bindable): HTMLButtonElement

**Collapsible.Content props:**
- `forceMount`: boolean, default false
- `hiddenUntilFound`: boolean, default false
- `ref` ($bindable): HTMLDivElement

**Data attributes:** `data-state` ('open'|'closed'), `data-disabled`, `data-collapsible-root/trigger/content`

**CSS variables:** `--bits-collapsible-content-height`, `--bits-collapsible-content-width`