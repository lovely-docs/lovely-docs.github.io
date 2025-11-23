## Collapsible

Interactive expand/collapse panel component.

### Installation

```bash
npx shadcn-svelte@latest add collapsible -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
</script>

<Collapsible.Root>
  <Collapsible.Trigger>Toggle label</Collapsible.Trigger>
  <Collapsible.Content>Hidden content</Collapsible.Content>
</Collapsible.Root>
```

Three main parts: `Root` (container), `Trigger` (toggle button), `Content` (expandable panel). Trigger can be styled with button variants and icons. Supports custom classes for layout.