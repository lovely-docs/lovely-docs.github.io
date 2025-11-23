## Radio Group

Mutually exclusive radio button component where only one option can be selected.

### Installation

```bash
npx shadcn-svelte@latest add radio-group -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
</script>

<RadioGroup.Root value="option-one">
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="option-one" id="option-one" />
    <Label for="option-one">Option One</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="option-two" id="option-two" />
    <Label for="option-two">Option Two</Label>
  </div>
</RadioGroup.Root>
```

### Form Integration

Use `bind:value={$formData.fieldName}` to connect to form state. Wrap items with `Form.Control` and `Form.Label` for proper form integration with validation support.