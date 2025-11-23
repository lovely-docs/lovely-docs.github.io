## Form Component Guide

Composable form components wrapping Formsnap and Superforms with Zod validation.

**Setup:**
1. Define Zod schema
2. Create load function with `superValidate(zod4(formSchema))`
3. Build form component using `Form.Field`, `Form.Control`, `Form.Label`, `Form.Description`, `Form.FieldErrors`
4. Create server action to validate and handle form submission

**Basic Example:**
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
    <Form.Description>Public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

**Installation:**
```bash
npx shadcn-svelte@latest add form -y -o
```

Works with Checkbox, Date Picker, Input, Radio Group, Select, Switch, Textarea.