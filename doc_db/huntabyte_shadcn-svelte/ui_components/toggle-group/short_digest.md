## Toggle Group

Two-state button group supporting single or multiple selection.

### Installation

```bash
npx shadcn-svelte@latest add toggle-group -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
</script>

<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
</ToggleGroup.Root>
```

### Props

- `type`: "single" or "multiple"
- `variant`: "outline"
- `size`: "sm" or "lg"
- `disabled`: boolean

### Examples

**Multiple with outline:**
```svelte
<ToggleGroup.Root variant="outline" type="multiple">
  <ToggleGroup.Item value="bold"><BoldIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="italic"><ItalicIcon class="size-4" /></ToggleGroup.Item>
</ToggleGroup.Root>
```

**Size variants:**
```svelte
<ToggleGroup.Root size="sm" type="multiple">...</ToggleGroup.Root>
<ToggleGroup.Root size="lg" type="multiple">...</ToggleGroup.Root>
```

**Disabled:**
```svelte
<ToggleGroup.Root disabled type="single">...</ToggleGroup.Root>
```