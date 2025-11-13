## Textarea Component

A form textarea component for shadcn-svelte.

### Installation

```bash
npm install shadcn-svelte@latest add textarea
```

### Basic Usage

```svelte
<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<Textarea placeholder="Type your message here." />
```

### Examples

**Disabled state:**
```svelte
<Textarea disabled placeholder="Type your message here." />
```

**With label and helper text:**
```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<div class="grid w-full gap-1.5">
  <Label for="message">Your message</Label>
  <Textarea placeholder="Type your message here." id="message" />
  <p class="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
</div>
```

**With button:**
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<div class="grid w-full gap-2">
  <Textarea placeholder="Type your message here." />
  <Button>Send message</Button>
</div>
```

**Form integration with validation:**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    bio: z.string().min(10).max(160)
  });
</script>

<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="bio">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Bio</Form.Label>
        <Textarea {...props} placeholder="Tell us about yourself" class="resize-none" bind:value={$formData.bio} />
        <Form.Description>You can @mention other users and organizations.</Form.Description>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```