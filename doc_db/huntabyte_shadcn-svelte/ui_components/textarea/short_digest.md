## Textarea

Form textarea component for text input.

### Installation

```bash
npx shadcn-svelte@latest add textarea -y -o
```

### Usage

```svelte
import { Textarea } from "$lib/components/ui/textarea/index.js";

<Textarea placeholder="Type your message here." />
<Textarea disabled placeholder="Type your message here." />
```

### With Labels, Text, and Buttons

```svelte
import { Label } from "$lib/components/ui/label/index.js";
import { Button } from "$lib/components/ui/button/index.js";

<div class="grid w-full gap-1.5">
  <Label for="message">Your message</Label>
  <Textarea placeholder="Type your message here." id="message" />
  <p class="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
</div>

<div class="grid w-full gap-2">
  <Textarea placeholder="Type your message here." />
  <Button>Send message</Button>
</div>
```

### Form with Validation

```svelte
import { z } from "zod/v4";
import { defaults, superForm } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import * as Form from "$lib/components/ui/form/index.js";

const formSchema = z.object({
  bio: z.string().min(10).max(160)
});

const form = superForm(defaults(zod4(formSchema)), {
  validators: zod4(formSchema),
  SPA: true
});

<form method="POST" use:enhance>
  <Form.Field {form} name="bio">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Bio</Form.Label>
        <Textarea {...props} placeholder="Tell us about yourself" bind:value={$formData.bio} />
        <Form.Description>You can @mention other users and organizations.</Form.Description>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```