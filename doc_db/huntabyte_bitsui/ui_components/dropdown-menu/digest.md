## Dropdown Menu Component

A menu component that displays selectable items when triggered. Supports groups, checkboxes, radio buttons, nested submenus, and keyboard navigation.

### Basic Structure
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item />
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

### State Management
- **Two-way binding**: `bind:open={isOpen}` for automatic synchronization
- **Fully controlled**: Use function bindings `bind:open={getOpen, setOpen}` for complete control
- State does not persist between open/close cycles unless stored in `$state`

### Grouping Items
Use `DropdownMenu.Group` with either `DropdownMenu.GroupHeading` or `aria-label`:
```svelte
<DropdownMenu.Group>
  <DropdownMenu.GroupHeading>File</DropdownMenu.GroupHeading>
  <DropdownMenu.Item>New</DropdownMenu.Item>
  <DropdownMenu.Item>Open</DropdownMenu.Item>
</DropdownMenu.Group>
```

### Checkbox Items
```svelte
<script>
  let notifications = $state(true);
</script>
<DropdownMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if checked}✅{/if}
    Notifications
  {/snippet}
</DropdownMenu.CheckboxItem>
```

### Checkbox Groups
Multiple checkboxes with array value:
```svelte
<script>
  let colors = $state<string[]>([]);
</script>
<DropdownMenu.CheckboxGroup bind:value={colors}>
  <DropdownMenu.CheckboxItem value="red">Red</DropdownMenu.CheckboxItem>
  <DropdownMenu.CheckboxItem value="blue">Blue</DropdownMenu.CheckboxItem>
</DropdownMenu.CheckboxGroup>
```

### Radio Groups
Single selection from multiple options:
```svelte
<script>
  let value = $state("one");
</script>
<DropdownMenu.RadioGroup bind:value>
  <DropdownMenu.RadioItem value="one">One</DropdownMenu.RadioItem>
  <DropdownMenu.RadioItem value="two">Two</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

### Nested Menus
```svelte
<DropdownMenu.Sub>
  <DropdownMenu.SubTrigger>Open Sub Menu</DropdownMenu.SubTrigger>
  <DropdownMenu.SubContent>
    <DropdownMenu.Item>Sub Item 1</DropdownMenu.Item>
  </DropdownMenu.SubContent>
</DropdownMenu.Sub>
```

### Svelte Transitions
Use `forceMount` with child snippet for animation control:
```svelte
<DropdownMenu.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <DropdownMenu.Item>Item 1</DropdownMenu.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</DropdownMenu.Content>
```

### Custom Anchor
Anchor content to a different element:
```svelte
<script>
  let customAnchor = $state<HTMLElement>(null!);
</script>
<div bind:this={customAnchor}></div>
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Content {customAnchor}>...</DropdownMenu.Content>
</DropdownMenu.Root>
```

### Key Props
- **Root**: `open` (bindable), `onOpenChange`, `dir`
- **Trigger**: `disabled`, `ref`
- **Content**: `side`, `sideOffset`, `align`, `alignOffset`, `avoidCollisions`, `trapFocus`, `forceMount`, `loop`, `customAnchor`
- **Item**: `disabled`, `textValue`, `onSelect`, `closeOnSelect`
- **CheckboxItem**: `checked` (bindable), `indeterminate` (bindable), `value`, `disabled`
- **RadioItem**: `value` (required), `disabled`
- **SubTrigger**: `disabled`, `openDelay`

### Data Attributes
- `data-state`: 'open' | 'closed'
- `data-highlighted`: Present when item is highlighted
- `data-disabled`: Present when item is disabled
- `data-dropdown-menu-*`: Component-specific identifiers