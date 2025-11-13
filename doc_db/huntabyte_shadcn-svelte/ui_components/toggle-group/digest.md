## Toggle Group

A set of two-state buttons that can be toggled on or off. Built on Bits UI.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add toggle-group
```

### Basic Usage

```svelte
<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
</script>

<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
  <ToggleGroup.Item value="c">C</ToggleGroup.Item>
</ToggleGroup.Root>
```

### Props & Variants

- `type`: "single" (one item at a time) or "multiple" (multiple items can be selected)
- `variant`: "outline" for outlined style
- `size`: "sm" or "lg" for different sizes (default is medium)
- `disabled`: disables all items in the group

### Example with Icons

```svelte
<ToggleGroup.Root variant="outline" type="multiple">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
    <BoldIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <ItalicIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
    <UnderlineIcon class="size-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```