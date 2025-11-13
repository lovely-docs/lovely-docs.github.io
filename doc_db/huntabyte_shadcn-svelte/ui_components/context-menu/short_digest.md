## Context Menu

Right-click triggered menu component.

```svelte
<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>Profile</ContextMenu.Item>
    <ContextMenu.CheckboxItem bind:checked={show}>Show</ContextMenu.CheckboxItem>
    <ContextMenu.RadioGroup bind:value>
      <ContextMenu.RadioItem value="a">Option A</ContextMenu.RadioItem>
      <ContextMenu.RadioItem value="b">Option B</ContextMenu.RadioItem>
    </ContextMenu.RadioGroup>
  </ContextMenu.Content>
</ContextMenu.Root>
```

Supports submenus, separators, disabled items, shortcuts, checkboxes, and radio groups.