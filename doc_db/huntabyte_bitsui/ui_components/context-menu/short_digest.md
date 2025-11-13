## Context Menu

Right-click triggered menu with items, checkboxes, radio groups, and nested submenus.

**Basic usage:**
```svelte
<ContextMenu.Root>
  <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Item>Edit</ContextMenu.Item>
      <ContextMenu.Item>Delete</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

**Checkbox items:**
```svelte
<ContextMenu.CheckboxItem bind:checked={value}>
  {#snippet children({ checked })}
    {#if checked}✅{/if}
    Option
  {/snippet}
</ContextMenu.CheckboxItem>
```

**Radio groups:**
```svelte
<ContextMenu.RadioGroup bind:value={selected}>
  <ContextMenu.RadioItem value="one">One</ContextMenu.RadioItem>
  <ContextMenu.RadioItem value="two">Two</ContextMenu.RadioItem>
</ContextMenu.RadioGroup>
```

**Nested menus:**
```svelte
<ContextMenu.Sub>
  <ContextMenu.SubTrigger>Add</ContextMenu.SubTrigger>
  <ContextMenu.SubContent>
    <ContextMenu.Item>Header</ContextMenu.Item>
  </ContextMenu.SubContent>
</ContextMenu.Sub>
```

**Animations:** Use `forceMount` on Content with `{#if open}` and Svelte transitions.

**State:** `bind:open` for two-way binding or function bindings for full control.