## Menubar Component

Horizontal bar with multiple menus supporting nested submenus, radio/checkbox items, and keyboard navigation.

### Basic Structure
```svelte
<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content>
        <Menubar.Item>Item</Menubar.Item>
        <Menubar.CheckboxItem bind:checked={val}>Label</Menubar.CheckboxItem>
        <Menubar.RadioGroup bind:value={selected}>
          <Menubar.RadioItem value="opt1">Option 1</Menubar.RadioItem>
        </Menubar.RadioGroup>
        <Menubar.Sub>
          <Menubar.SubTrigger>Submenu</Menubar.SubTrigger>
          <Menubar.SubContent>
            <Menubar.Item>Sub Item</Menubar.Item>
          </Menubar.SubContent>
        </Menubar.Sub>
        <Menubar.Separator />
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
```

### State Management
```svelte
<!-- Two-way binding -->
<script>
  let activeValue = $state("");
</script>
<Menubar.Root bind:value={activeValue}>
  <Menubar.Menu value="menu-1">...</Menubar.Menu>
</Menubar.Root>

<!-- Fully controlled -->
<Menubar.Root bind:value={getValue, setValue}>
  <Menubar.Menu value="menu-1">...</Menubar.Menu>
</Menubar.Root>
```

### Checkbox & Radio Items
```svelte
<Menubar.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {indeterminate ? "-" : checked ? "✅" : ""} Notifications
  {/snippet}
</Menubar.CheckboxItem>

<Menubar.CheckboxGroup bind:value={colors}>
  <Menubar.GroupHeading>Color</Menubar.GroupHeading>
  <Menubar.CheckboxItem value="red">Red</Menubar.CheckboxItem>
  <Menubar.CheckboxItem value="blue">Blue</Menubar.CheckboxItem>
</Menubar.CheckboxGroup>

<Menubar.RadioGroup bind:value={selected}>
  <Menubar.RadioItem value="one">One</Menubar.RadioItem>
  <Menubar.RadioItem value="two">Two</Menubar.RadioItem>
</Menubar.RadioGroup>
```

### Reusable Menu Component
```svelte
<!-- MyMenubarMenu.svelte -->
<script lang="ts">
  import { Menubar, type WithoutChildrenOrChild } from "bits-ui";
  type Props = WithoutChildrenOrChild<Menubar.MenuProps> & {
    triggerText: string;
    items: { label: string; value: string; onSelect?: () => void }[];
    contentProps?: WithoutChildrenOrChild<Menubar.ContentProps>;
  };
  let { triggerText, items, contentProps, ...restProps }: Props = $props();
</script>
<Menubar.Menu {...restProps}>
  <Menubar.Trigger>{triggerText}</Menubar.Trigger>
  <Menubar.Content {...contentProps}>
    <Menubar.Group aria-label={triggerText}>
      {#each items as item}
        <Menubar.Item textValue={item.label} onSelect={item.onSelect}>
          {item.label}
        </Menubar.Item>
      {/each}
    </Menubar.Group>
  </Menubar.Content>
</Menubar.Menu>

<!-- Usage -->
<Menubar.Root>
  {#each menubarMenus as { title, items }}
    <MyMenubarMenu triggerText={title} {items} />
  {/each}
</Menubar.Root>
```

### Transitions
```svelte
<Menubar.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <Menubar.Item>Item 1</Menubar.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</Menubar.Content>
```

### Key Props

**Menubar.Root**: `value` (bindable), `onValueChange`, `dir` ('ltr'|'rtl'), `loop` (default: true)

**Menubar.Content**: `side` ('top'|'bottom'|'left'|'right'), `sideOffset`, `align` ('start'|'center'|'end'), `avoidCollisions` (default: true), `sticky` ('partial'|'always'), `strategy` ('fixed'|'absolute'), `trapFocus` (default: true), `forceMount`, `loop`

**Menubar.Item**: `disabled`, `textValue`, `onSelect`, `closeOnSelect` (default: true)

**Menubar.CheckboxItem**: `checked` (bindable), `indeterminate` (bindable), `value`, `disabled`, `closeOnSelect` (default: true)

**Menubar.RadioItem**: `value` (required), `disabled`, `closeOnSelect` (default: true)

**Menubar.SubTrigger**: `disabled`, `openDelay` (default: 100ms)

Note: Checkbox group values don't persist between open/close cycles; use `$state` to persist.