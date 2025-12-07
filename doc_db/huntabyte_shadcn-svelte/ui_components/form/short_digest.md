## Form Component Guide

Composable form components wrapping Formsnap & Superforms with Zod validation, automatic ARIA attributes, and UI component integration.

**Install:**
```bash
npx shadcn-svelte@latest add form -y -o
```

**Basic setup:**
1. Define Zod schema
2. Load form via `superValidate(zod4(formSchema))`
3. Create form component using `Form.Field`, `Form.Control`, `Form.Label`, `Form.Description`, `Form.FieldErrors`
4. Use `superForm()` hook with validators
5. Handle submission via server action

**Example:**
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

Supports client/server validation, keyboard navigation, and accessibility attributes.