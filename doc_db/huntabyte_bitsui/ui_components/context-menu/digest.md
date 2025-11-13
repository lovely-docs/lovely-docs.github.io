## Context Menu Component

A right-click triggered menu displaying contextual options and actions.

### Basic Structure
```svelte
<ContextMenu.Root>
  <ContextMenu.Trigger>Right click me</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Item>Edit</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item>Delete</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

### State Management
Use `bind:open` for two-way binding or function bindings for complete control:
```svelte
<script>
  let isOpen = $state(false);
</script>
<ContextMenu.Root bind:open={isOpen}>
```

### Menu Item Types

**Checkbox Items** - Toggle state with visual feedback:
```svelte
<ContextMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if checked}✅{/if}
    Notifications
  {/snippet}
</ContextMenu.CheckboxItem>
```

**Radio Groups** - Single selection from multiple options:
```svelte
<ContextMenu.RadioGroup bind:value={selectedOption}>
  {#each options as option}
    <ContextMenu.RadioItem {option}>
      {#snippet children({ checked })}
        {#if checked}✅{/if}
        {option}
      {/snippet}
    </ContextMenu.RadioItem>
  {/each}
</ContextMenu.RadioGroup>
```

**Checkbox Groups** - Multiple selections:
```svelte
<ContextMenu.CheckboxGroup bind:value={colors}>
  <ContextMenu.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}✅{/if}
      Red
    {/snippet}
  </ContextMenu.CheckboxItem>
</ContextMenu.CheckboxGroup>
```

### Nested Menus
```svelte
<ContextMenu.Sub>
  <ContextMenu.SubTrigger>Add</ContextMenu.SubTrigger>
  <ContextMenu.SubContent>
    <ContextMenu.Item>Header</ContextMenu.Item>
    <ContextMenu.Item>Paragraph</ContextMenu.Item>
  </ContextMenu.SubContent>
</ContextMenu.Sub>
```

### Animations with Transitions
Use `forceMount` to enable Svelte transitions:
```svelte
<ContextMenu.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <ContextMenu.Item>Item 1</ContextMenu.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</ContextMenu.Content>
```

### Reusable Component Pattern
Create wrapper components accepting custom props like `trigger` snippet, `items` array, and `contentProps` for flexible menu configurations.

### Key Props
- `ContextMenu.Root`: `open` (bindable), `onOpenChange`, `onOpenChangeComplete`, `dir`
- `ContextMenu.Trigger`: `disabled`, `ref`
- `ContextMenu.Content`: Floating UI positioning (`side`, `align`, `sideOffset`), collision handling, `forceMount`, `loop`, `trapFocus`
- `ContextMenu.Item`: `disabled`, `textValue`, `onSelect`, `closeOnSelect`
- `ContextMenu.CheckboxItem`: `checked` (bindable), `indeterminate` (bindable), `value`
- `ContextMenu.RadioItem`: `value` (required), `disabled`
- `ContextMenu.Sub`: `open` (bindable), `onOpenChange`
- `ContextMenu.SubContent`: Floating UI positioning options, `sideOffset`

### Data Attributes
Items expose `data-highlighted`, `data-disabled`, `data-state` for styling. Content exposes `data-state` for open/closed styling.