## Dropdown Menu

Displays selectable menu items when triggered. Supports groups, checkboxes, radio buttons, nested submenus, and keyboard navigation.

**Basic structure:**
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item />
      <DropdownMenu.CheckboxItem />
      <DropdownMenu.RadioGroup><DropdownMenu.RadioItem /></DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

**State management:**
```svelte
<script>
  let isOpen = $state(false);
</script>
<DropdownMenu.Root bind:open={isOpen}>
```

**Groups, checkboxes, radio buttons:**
```svelte
<DropdownMenu.Group aria-label="file">
  <DropdownMenu.Item>New</DropdownMenu.Item>
</DropdownMenu.Group>

<DropdownMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked })}
    {#if checked}✅{/if} Notifications
  {/snippet}
</DropdownMenu.CheckboxItem>

<DropdownMenu.RadioGroup bind:value>
  <DropdownMenu.RadioItem value="one">
    {#snippet children({ checked })}
      {#if checked}✅{/if} One
    {/snippet}
  </DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

**Nested menus:**
```svelte
<DropdownMenu.Sub>
  <DropdownMenu.SubTrigger>Submenu</DropdownMenu.SubTrigger>
  <DropdownMenu.SubContent>
    <DropdownMenu.Item>Sub Item</DropdownMenu.Item>
  </DropdownMenu.SubContent>
</DropdownMenu.Sub>
```

**Transitions with forceMount:**
```svelte
<DropdownMenu.Content forceMount>
  {#snippet child({ open })}
    {#if open}
      <div transition:fly>
        <DropdownMenu.Item>Item</DropdownMenu.Item>
      </div>
    {/if}
  {/snippet}
</DropdownMenu.Content>
```

**Custom anchor:**
```svelte
<div bind:this={customAnchor}></div>
<DropdownMenu.Content {customAnchor}>
```

**Key props:** Root: `open`, `onOpenChange`; Content: `side`, `sideOffset`, `align`, `sticky`, `preventScroll`, `trapFocus`, `forceMount`, `loop`; Item: `disabled`, `onSelect`, `closeOnSelect`; CheckboxItem: `checked`, `indeterminate`, `value`; RadioItem: `value` (required)