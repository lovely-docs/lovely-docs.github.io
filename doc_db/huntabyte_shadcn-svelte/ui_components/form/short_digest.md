## Form Components

Build accessible, type-safe forms with Formsnap, Superforms, and Zod validation.

**Setup**: Define Zod schema → setup load function with `superValidate` → create form component using `Form.Field`, `Form.Control`, `Form.Label`, `Form.FieldErrors` → create server action for validation.

**Example**:
```svelte
<script>
  import * as Form from "$lib/components/ui/form/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  
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
    <Form.FieldErrors />
  </Form.Field>
</form>
```

**Install**: `pnpm dlx shadcn-svelte@latest add form`