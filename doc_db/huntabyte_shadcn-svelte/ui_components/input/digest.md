## Input Component

A form input field component for text, email, file, and other input types.

### Installation
```bash
npm install shadcn-svelte@latest add input
```

### Basic Usage
```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<Input type="email" placeholder="email" />
```

### Examples

**Disabled state:**
```svelte
<Input disabled type="email" placeholder="email" />
```

**With label:**
```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email">Email</Label>
  <Input type="email" id="email" placeholder="email" />
</div>
```

**With helper text:**
```svelte
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
  <p class="text-muted-foreground text-sm">Enter your email address.</p>
</div>
```

**With button:**
```svelte
<form class="flex w-full max-w-sm items-center space-x-2">
  <Input type="email" placeholder="email" />
  <Button type="submit">Subscribe</Button>
</form>
```

**Invalid state:**
```svelte
<Input aria-invalid type="email" placeholder="email" value="shadcn@example" />
```

**File input:**
```svelte
<div class="grid w-full max-w-sm items-center gap-1.5">
  <Label for="picture">Picture</Label>
  <Input id="picture" type="file" />
</div>
```

**With form validation (using sveltekit-superforms and zod):**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    username: z.string().min(2).max(50)
  });
</script>
<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true
  });
  const { form: formData, enhance } = form;
</script>
<form method="POST" class="w-2/3 space-y-6" use:enhance>
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