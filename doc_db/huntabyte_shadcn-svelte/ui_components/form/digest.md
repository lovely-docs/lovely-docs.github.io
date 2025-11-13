## Form Components with Formsnap & Superforms

Building accessible, type-safe forms using shadcn-svelte's Form components, which wrap Formsnap and Superforms.

### Features
- Composable form field components with state scoping
- Zod validation (client & server-side)
- Automatic ARIA attributes based on field state
- Integration with Select, RadioGroup, Switch, Checkbox, and other form components

### Anatomy
```svelte
<form>
  <Form.Field>
    <Form.Control>
      <Form.Label />
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>
</form>
```

### Setup Steps

1. **Define schema** (src/routes/settings/schema.ts):
```ts
import { z } from "zod";
export const formSchema = z.object({
  username: z.string().min(2).max(50),
});
```

2. **Setup load function** (src/routes/settings/+page.server.ts):
```ts
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
export const load = async () => {
  return { form: await superValidate(zod4(formSchema)) };
};
```

3. **Create form component** (src/routes/settings/settings-form.svelte):
```svelte
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  
  let { data } = $props();
  const form = superForm(data.form, { validators: zod4Client(formSchema) });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

4. **Create server action** for validation:
```ts
export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));
    if (!form.valid) return fail(400, { form });
    return { form };
  },
};
```

### Installation
```bash
pnpm dlx shadcn-svelte@latest add form
```

### Notes
- Form labels automatically associate with inputs via `for` attribute
- Accessibility attributes applied via spreading `props` from Form.Control
- See Checkbox, Date Picker, Input, Radio Group, Select, Switch, Textarea component docs for additional form examples