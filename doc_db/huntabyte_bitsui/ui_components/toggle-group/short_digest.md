## ToggleGroup

Groups toggle controls with single or multiple selection modes.

**Types:** `'single'` (string value) or `'multiple'` (string[] value)

**Basic usage:**
```svelte
<script lang="ts">
  let value = $state(["bold"]);
</script>
<ToggleGroup.Root bind:value type="multiple">
  <ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

**Key props:** `type` (required), `value` ($bindable), `onValueChange`, `disabled`, `orientation`, `loop`, `rovingFocus`

**Item props:** `value`, `disabled`

**Data attributes:** `data-state` ('on'|'off'), `data-orientation`, `data-disabled`