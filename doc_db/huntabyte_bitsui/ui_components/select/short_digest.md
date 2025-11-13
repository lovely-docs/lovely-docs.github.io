## Select Component

Dropdown for single or multiple selection with typeahead, keyboard navigation, and accessibility.

### State Management
```svelte
<script>
  let value = $state("");
</script>
<Select.Root type="single" bind:value>
  <!-- ... -->
</Select.Root>
```

### Multiple Selection
```svelte
<script>
  let value = $state<string[]>([]);
</script>
<Select.Root type="multiple" bind:value>
  <!-- ... -->
</Select.Root>
```

### Positioning
- **Floating UI** (default): `Select.Content` with `side`, `sideOffset`, `align`, `alignOffset`
- **Static**: `Select.ContentStatic` for manual positioning
- **Custom anchor**: `customAnchor` prop

### Scroll Buttons
```svelte
<Select.Viewport>
  {#each items as item}
    <Select.Item value={item.value}>{item.label}</Select.Item>
  {/each}
</Select.Viewport>
<Select.ScrollUpButton delay={tick => 50} />
<Select.ScrollDownButton delay={tick => 50} />
```

### Animations with Transitions
```svelte
<Select.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly><!-- content --></div>
      </div>
    {/if}
  {/snippet}
</Select.Content>
```

### Reusable Wrapper
Create wrapper component to avoid repeating structure with `Select.Root`, `Select.Trigger`, `Select.Portal`, `Select.Content`, `Select.Viewport`, and `Select.Item` components.