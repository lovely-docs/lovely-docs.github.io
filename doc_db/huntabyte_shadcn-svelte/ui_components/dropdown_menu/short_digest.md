## Dropdown Menu

Menu component triggered by a button, displaying actions or functions.

**Installation:** `pnpm dlx shadcn-svelte@latest add dropdown-menu`

**Basic structure:**
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>Action</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

**Key components:** Root, Trigger, Content, Group, Label, Item, Separator, Sub/SubTrigger/SubContent, Shortcut, CheckboxItem, RadioGroup/RadioItem

**Stateful items:**
```svelte
<DropdownMenu.CheckboxItem bind:checked={state}>Label</DropdownMenu.CheckboxItem>
<DropdownMenu.RadioGroup bind:value={selected}>
  <DropdownMenu.RadioItem value="option">Option</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```