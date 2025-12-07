## Toggle Group

Groups multiple toggles with single or multiple selection modes.

**Modes:** `type="single"` (string value) or `type="multiple"` (array value)

**State management:**
```svelte
<script lang="ts">
  let value = $state("");
</script>
<ToggleGroup.Root type="single" bind:value>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

**Key props:** `type` (required), `value` ($bindable), `onValueChange`, `disabled`, `loop`, `orientation`, `rovingFocus`

**Item props:** `value` (required), `disabled`

**Data attributes:** `data-state` ('on'|'off'), `data-orientation`, `data-disabled`