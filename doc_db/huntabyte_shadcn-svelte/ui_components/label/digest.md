## Label Component

Renders an accessible label associated with form controls.

### Installation

```bash
npx shadcn-svelte@latest add label -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Usage

Import the Label component:

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Label for="email">Your email address</Label>
```

### Example with Checkbox

```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

The `for` attribute associates the label with a form control by matching the control's `id`.

For full API reference and additional documentation, see the Bits UI Label documentation.