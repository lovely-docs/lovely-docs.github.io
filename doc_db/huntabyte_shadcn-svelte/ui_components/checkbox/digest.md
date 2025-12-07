## Checkbox

A control that allows the user to toggle between checked and not checked.

### Installation

```bash
npx shadcn-svelte@latest add checkbox -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Checkbox />

<div class="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

### States

- **Unchecked**: Default state
- **Checked**: Pass `checked` prop
- **Disabled**: Pass `disabled` prop

```svelte
<Checkbox id="terms-2" checked />
<Checkbox id="toggle" disabled />
```

### Styling

Customize appearance with class prop:

```svelte
<Checkbox
  id="toggle-2"
  checked
  class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
/>
```

Use `has-[[aria-checked=true]]` selector on parent Label for conditional styling:

```svelte
<Label class="has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50">
  <Checkbox id="toggle-2" checked />
</Label>
```

### Form Integration

Use with sveltekit-superforms for form handling:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item."
    })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    SPA: true,
    validators: zod4(formSchema),
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`Submitted: ${JSON.stringify(f.data, null, 2)}`);
      }
    }
  });
  const { form: formData, enhance } = form;

  function addItem(id: string) {
    $formData.items = [...$formData.items, id];
  }
  function removeItem(id: string) {
    $formData.items = $formData.items.filter((i) => i !== id);
  }
</script>

<form method="POST" use:enhance>
  <Form.Fieldset {form} name="items">
    <Form.Legend>Sidebar</Form.Legend>
    <Form.Description>Select items to display</Form.Description>
    {#each items as item (item.id)}
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
    <Form.FieldErrors />
  </Form.Fieldset>
  <Form.Button>Update</Form.Button>
</form>
```

Checkbox emits `onCheckedChange` event when toggled. Use with form libraries for validation and submission handling.