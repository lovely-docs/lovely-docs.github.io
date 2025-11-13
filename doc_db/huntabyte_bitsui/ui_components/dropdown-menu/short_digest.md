## Dropdown Menu

Displays selectable menu items with support for groups, checkboxes, radio buttons, and nested submenus.

### Basic Usage
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item>Profile</DropdownMenu.Item>
      <DropdownMenu.Item>Settings</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

### State Management
- Two-way binding: `bind:open={isOpen}`
- Fully controlled: `bind:open={getOpen, setOpen}`

### Checkbox Items
```svelte
<DropdownMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked })}
    {#if checked}✅{/if} Notifications
  {/snippet}
</DropdownMenu.CheckboxItem>
```

### Radio Groups
```svelte
<DropdownMenu.RadioGroup bind:value>
  <DropdownMenu.RadioItem value="one">One</DropdownMenu.RadioItem>
  <DropdownMenu.RadioItem value="two">Two</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

### Nested Menus
```svelte
<DropdownMenu.Sub>
  <DropdownMenu.SubTrigger>Submenu</DropdownMenu.SubTrigger>
  <DropdownMenu.SubContent>
    <DropdownMenu.Item>Sub Item</DropdownMenu.Item>
  </DropdownMenu.SubContent>
</DropdownMenu.Sub>
```

### Transitions
```svelte
<DropdownMenu.Content forceMount>
  {#snippet child({ open })}
    {#if open}
      <div transition:fly>...</div>
    {/if}
  {/snippet}
</DropdownMenu.Content>
```