## ToggleGroup Component

Groups multiple toggle controls allowing users to enable one or multiple options.

### Types
- `'single'`: Only one item selected at a time, `value` is a string
- `'multiple'`: Multiple items selected, `value` is a string array

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
</script>
<ToggleGroup.Root type="single" bind:value={myValue}>
  <ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
</ToggleGroup.Root>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<ToggleGroup.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</ToggleGroup.Root>
```

### ToggleGroup.Root Props
- `type` (required): `'single'` | `'multiple'`
- `value` ($bindable): `string` | `string[]`
- `onValueChange`: callback when value changes
- `disabled`: boolean (default: false)
- `loop`: keyboard navigation loops (default: true)
- `orientation`: `'horizontal'` | `'vertical'` (default: 'horizontal')
- `rovingFocus`: use roving focus for navigation (default: true)
- `ref` ($bindable): `HTMLDivElement`

Data attributes: `data-orientation`, `data-toggle-group-root`

### ToggleGroup.Item Props
- `value` (required): string
- `disabled`: boolean (default: false)
- `ref` ($bindable): `HTMLButtonElement`

Data attributes: `data-state` ('on' | 'off'), `data-value`, `data-orientation`, `data-disabled`, `data-toggle-group-item`