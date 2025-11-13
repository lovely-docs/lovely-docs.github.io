## Tabs Component

Organizes content into tabbed sections with keyboard navigation support.

### Basic Structure
```svelte
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content 1</Tabs.Content>
  <Tabs.Content value="tab-2">Content 2</Tabs.Content>
</Tabs.Root>
```

### State Management

**Two-way binding:**
```svelte
<script>
  let myValue = $state("");
</script>
<Tabs.Root bind:value={myValue}>
```

**Fully controlled with function binding:**
```svelte
<script>
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue) { myValue = newValue; }
</script>
<Tabs.Root bind:value={getValue, setValue}>
```

### Configuration

- **`orientation`**: `'horizontal'` (default) or `'vertical'` - controls keyboard navigation (ArrowLeft/Right for horizontal, ArrowUp/Down for vertical)
- **`activationMode`**: `'automatic'` (default) or `'manual'` - automatic activates tab on trigger focus, manual requires pressing the trigger
- **`disabled`**: boolean - disables all tabs
- **`loop`**: boolean (default true) - keyboard navigation wraps around

### API

**Tabs.Root** - Root container
- `value` (bindable): active tab value
- `onValueChange`: callback when value changes
- `activationMode`, `disabled`, `loop`, `orientation` props

**Tabs.List** - Container for triggers

**Tabs.Trigger** - Tab button
- `value` (required): tab identifier
- `disabled`: disable individual tab

**Tabs.Content** - Tab panel
- `value` (required): must match trigger value