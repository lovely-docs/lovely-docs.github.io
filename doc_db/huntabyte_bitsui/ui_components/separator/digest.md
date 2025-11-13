## Separator Component

A headless UI component for visually separating content or UI elements.

### Basic Usage

```svelte
<script lang="ts">
  import { Separator } from "bits-ui";
</script>

<Separator.Root />
```

### Horizontal and Vertical Separators

```svelte
<!-- Horizontal separator (default) -->
<div>
  <h4>Bits UI</h4>
  <p>Headless UI components for Svelte.</p>
  <Separator.Root class="bg-border my-4 h-px w-full" />
</div>

<!-- Vertical separators -->
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <Separator.Root orientation="vertical" class="bg-border w-[1px] h-full" />
  <div>Docs</div>
  <Separator.Root orientation="vertical" class="bg-border w-[1px] h-full" />
  <div>Source</div>
</div>
```

### API Reference

**Separator.Root** - The separator element

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the separator |
| `decorative` | `boolean` | `false` | Whether the separator is decorative (affects screen reader announcement) |
| `ref` | `HTMLDivElement` | `null` | Bindable reference to the underlying DOM element |
| `children` | `Snippet` | `undefined` | Children content to render |
| `child` | `Snippet` | `undefined` | Render delegation snippet for custom element rendering |

**Data Attributes**

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-orientation` | `'horizontal' \| 'vertical'` | The orientation of the separator |
| `data-separator-root` | `''` | Present on the root element |