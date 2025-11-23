## Separator

Visual/semantic content separator component.

### Installation

```bash
npx shadcn-svelte@latest add separator -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<Separator />
<Separator orientation="vertical" />
```

Supports `orientation` prop (`"vertical"` for vertical separators) and `class` prop for styling.