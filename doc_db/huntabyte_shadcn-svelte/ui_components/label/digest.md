## Label Component

Renders an accessible label associated with form controls.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add label
```

### Usage

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
</script>

<div class="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

The `Label` component accepts a `for` prop to associate it with a form control by ID. See the Bits UI documentation for the full API reference.