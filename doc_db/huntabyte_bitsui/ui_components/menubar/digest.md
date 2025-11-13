## Menubar Component

A horizontal bar containing multiple menus with dropdown content. Each menu can contain items, checkboxes, radio buttons, and nested submenus.

### Basic Structure
```svelte
<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content>
        <Menubar.Item>Item 1</Menubar.Item>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
```

### Checkbox Items
Use `Menubar.CheckboxItem` for toggleable items. Combine multiple with `Menubar.CheckboxGroup` to manage an array of selected values:
```svelte
<Menubar.CheckboxGroup bind:value={colors}>
  <Menubar.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}✅{/if} Red
    {/snippet}
  </Menubar.CheckboxItem>
</Menubar.CheckboxGroup>
```

### Radio Items
Use `Menubar.RadioGroup` with `Menubar.RadioItem` for single-selection menus:
```svelte
<Menubar.RadioGroup bind:value={selectedView}>
  <Menubar.RadioItem value="table">
    {#snippet children({ checked })}
      {#if checked}✅{/if} Table
    {/snippet}
  </Menubar.RadioItem>
</Menubar.RadioGroup>
```

### Nested Menus
Create submenus with `Menubar.Sub`, `Menubar.SubTrigger`, and `Menubar.SubContent`:
```svelte
<Menubar.Sub>
  <Menubar.SubTrigger>Find</Menubar.SubTrigger>
  <Menubar.SubContent>
    <Menubar.Item>Search the web</Menubar.Item>
  </Menubar.SubContent>
</Menubar.Sub>
```

### State Management
Control which menu is active via `Menubar.Root`:
```svelte
<Menubar.Root bind:value={activeValue}>
  <Menubar.Menu value="menu-1">...</Menubar.Menu>
</Menubar.Root>
```

Or use function bindings for complete control:
```svelte
<Menubar.Root bind:value={getValue, setValue}>
```

### Reusable Components
Create wrapper components to avoid repetition when using the same menu structure multiple times.

### Transitions
Use `forceMount` prop with the `child` snippet to enable Svelte transitions on content visibility.

### Other Components
- `Menubar.Separator`: Visual divider between items
- `Menubar.Arrow`: Optional pointer to trigger
- `Menubar.Group` / `Menubar.GroupHeading`: Organize items into labeled groups
- `Menubar.Portal`: Portal content to body or custom target