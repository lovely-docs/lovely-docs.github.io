Right-click context menu component with items, separators, checkboxes, radio groups, and nested submenus.

**Install:** `npx shadcn-svelte@latest add context-menu -y -o`

**Basic structure:**
```svelte
<ContextMenu.Root>
  <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>Action</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.CheckboxItem bind:checked={state}>Toggle</ContextMenu.CheckboxItem>
    <ContextMenu.RadioGroup bind:value>
      <ContextMenu.RadioItem value="a">Option A</ContextMenu.RadioItem>
    </ContextMenu.RadioGroup>
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>Submenu</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item>Nested Item</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  </ContextMenu.Content>
</ContextMenu.Root>
```

Supports `inset`, `disabled` props on items; `Shortcut` for keyboard hints; `Group`/`GroupHeading` for organization.