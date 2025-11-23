## Toggle Group

A set of two-state buttons that can be toggled on or off. Supports single or multiple selection modes.

### Installation

```bash
npx shadcn-svelte@latest add toggle-group -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

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

### Key Props

- `type`: "single" (only one item can be selected) or "multiple" (multiple items can be selected)
- `variant`: "outline" for outlined style
- `size`: "sm" or "lg" for different sizes (default is medium)
- `disabled`: disables all items in the group

### Examples

**Multiple selection with outline variant:**
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

**Single selection:**
```svelte
<ToggleGroup.Root type="single">
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

**Size variants:**
```svelte
<ToggleGroup.Root size="sm" type="multiple">
  <!-- items -->
</ToggleGroup.Root>

<ToggleGroup.Root size="lg" type="multiple">
  <!-- items -->
</ToggleGroup.Root>
```

**Disabled state:**
```svelte
<ToggleGroup.Root disabled type="single">
  <!-- items -->
</ToggleGroup.Root>
```

Each `ToggleGroup.Item` accepts a `value` prop and should include an `aria-label` for accessibility. Icons can be nested inside items.