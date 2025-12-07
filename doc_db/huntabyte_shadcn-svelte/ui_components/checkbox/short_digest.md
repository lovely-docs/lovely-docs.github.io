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

<Checkbox />
<Checkbox checked />
<Checkbox disabled />

<div class="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms</Label>
</div>
```

### Styling

Use `class` prop with `data-[state=checked]` selector:

```svelte
<Checkbox class="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white" />
```

Parent Label can use `has-[[aria-checked=true]]` for conditional styling.

### Form Integration

```svelte
<Form.Fieldset {form} name="items">
  {#each items as item}
    {@const checked = $formData.items.includes(item.id)}
    <Checkbox
      {checked}
      value={item.id}
      onCheckedChange={(v) => {
        if (v) $formData.items = [...$formData.items, item.id];
        else $formData.items = $formData.items.filter((i) => i !== item.id);
      }}
    />
  {/each}
</Form.Fieldset>
```

Emits `onCheckedChange` event on toggle.