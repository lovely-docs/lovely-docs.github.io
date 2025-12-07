## Label

Renders an accessible label associated with form controls.

### Installation

```bash
npx shadcn-svelte@latest add label -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

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

<Label for="email">Your email address</Label>
```

The `for` attribute associates the label with a form control by its `id`.

See the Bits UI documentation for the full API reference.