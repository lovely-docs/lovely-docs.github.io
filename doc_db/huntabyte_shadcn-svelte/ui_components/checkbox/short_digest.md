## Checkbox

Toggle control for checked/unchecked states.

### Installation

```bash
npx shadcn-svelte@latest add checkbox -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Checkbox id="terms" />
<Label for="terms">Accept terms</Label>
```

### States & Styling

```svelte
<Checkbox checked />
<Checkbox disabled />
<Checkbox class="data-[state=checked]:bg-blue-600" />
```

### Form Integration

```svelte
<Form.Fieldset {form} name="items">
  {#each items as item}
    <Checkbox
      checked={$formData.items.includes(item.id)}
      onCheckedChange={(v) => {
        if (v) $formData.items = [...$formData.items, item.id];
        else $formData.items = $formData.items.filter((i) => i !== item.id);
      }}
    />
  {/each}
</Form.Fieldset>
```

Use `data-[state=checked]` for styling checked state and `onCheckedChange` for state updates.