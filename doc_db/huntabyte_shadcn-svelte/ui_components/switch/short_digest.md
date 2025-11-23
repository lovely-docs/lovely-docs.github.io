## Switch Component

Toggle control for binary states.

### Installation

```bash
npx shadcn-svelte@latest add switch -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

### Form Integration

Bind to form state with `bind:checked={$formData.fieldName}`. Supports `disabled` and `aria-readonly` attributes.