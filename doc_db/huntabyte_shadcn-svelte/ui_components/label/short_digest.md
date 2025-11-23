## Label Component

Accessible label for form controls.

### Installation

```bash
npx shadcn-svelte@latest add label -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Label for="email">Your email address</Label>
```

Use the `for` attribute to associate the label with a form control's `id`.