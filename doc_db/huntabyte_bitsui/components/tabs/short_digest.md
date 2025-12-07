## Tabs Component

Organizes content into tabbed sections with state management via `bind:value` or function binding.

**Orientation & Activation:**
- `orientation`: 'horizontal' (ArrowLeft/Right) | 'vertical' (ArrowUp/Down)
- `activationMode`: 'automatic' (focus) | 'manual' (press)

**Structure:**
```svelte
<Tabs.Root bind:value={myValue} orientation="horizontal" activationMode="automatic">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content</Tabs.Content>
</Tabs.Root>
```

**Key props:** `value`, `onValueChange`, `disabled`, `loop` (default true), `ref` (bindable)