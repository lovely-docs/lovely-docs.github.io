## Checkbox Component

A toggle control for checked/unchecked states.

### Installation
```bash
npm install shadcn-svelte@latest add checkbox
```

### Basic Usage
```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
</script>
<Checkbox />
```

### States
- Unchecked: `<Checkbox id="terms" />`
- Checked: `<Checkbox id="terms-2" checked />`
- Disabled: `<Checkbox id="toggle" disabled />`

### With Label
```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>
<div class="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

### Styling
Apply custom styles via `class` prop:
```svelte
<Checkbox
  id="toggle-2"
  checked
  class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
/>
```

### Form Integration
Use with sveltekit-superforms for form handling:
```svelte
<Form.Fieldset {form} name="items">
  {#each items as item}
    {@const checked = $formData.items.includes(item.id)}
    <Form.Control>
      {#snippet children({ props })}
        <Checkbox
          {...props}
          {checked}
          value={item.id}
          onCheckedChange={(v) => {
            if (v) addItem(item.id);
            else removeItem(item.id);
          }}
        />
        <Form.Label>{item.label}</Form.Label>
      {/snippet}
    </Form.Control>
  {/each}
</Form.Fieldset>
```

See Bits UI documentation for full API reference.