## Collapsible Component

Expandable/collapsible panel component.

### Installation
```bash
npm install shadcn-svelte@latest add collapsible
```

### Usage
```svelte
<script lang="ts">
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
</script>

<Collapsible.Root>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>Hidden content</Collapsible.Content>
</Collapsible.Root>
```

**Components:** `Root`, `Trigger`, `Content`