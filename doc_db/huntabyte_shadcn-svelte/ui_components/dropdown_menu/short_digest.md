## Dropdown Menu

Menu component triggered by a button, displaying actions or functions.

### Installation

```bash
npx shadcn-svelte@latest add dropdown-menu -y -o
```

### Basic Structure

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props}>Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Item>Profile</DropdownMenu.Item>
    <DropdownMenu.Item disabled>API</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Key Components

- **Root/Trigger/Content**: Basic structure
- **Item/Label/Group/Separator**: Menu organization
- **Shortcut**: Display keyboard shortcuts
- **Sub/SubTrigger/SubContent**: Nested submenus
- **CheckboxItem**: `bind:checked` for state
- **RadioGroup/RadioItem**: `bind:value` for selection