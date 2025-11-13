## Switch Component

A toggle control for checked/unchecked states.

### Basic Usage
```svelte
<script lang="ts">
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>
<div class="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

### Installation
```bash
npx shadcn-svelte@latest add switch
```

### Form Integration
Use with sveltekit-superforms and zod for form validation:
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    marketing_emails: z.boolean().default(false),
    security_emails: z.boolean().default(true)
  });
</script>
<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`Submitted: ${JSON.stringify(f.data, null, 2)}`);
      }
    }
  });
  const { form: formData, enhance } = form;
</script>
<form method="POST" use:enhance>
  <Form.Field {form} name="marketing_emails">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Marketing emails</Form.Label>
        <Switch {...props} bind:checked={$formData.marketing_emails} />
      {/snippet}
    </Form.Control>
  </Form.Field>
</form>
```

Supports `disabled` and `aria-readonly` attributes.