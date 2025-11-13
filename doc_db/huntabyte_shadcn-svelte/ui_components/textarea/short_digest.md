## Textarea Component

Install: `npm install shadcn-svelte@latest add textarea`

Import: `import { Textarea } from "$lib/components/ui/textarea/index.js";`

**Basic:** `<Textarea placeholder="Type your message here." />`

**Disabled:** `<Textarea disabled placeholder="..." />`

**With label and helper text:**
```svelte
<Label for="message">Your message</Label>
<Textarea placeholder="..." id="message" />
<p class="text-muted-foreground text-sm">Helper text</p>
```

**Form with validation:**
```svelte
<Form.Field {form} name="bio">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Bio</Form.Label>
      <Textarea {...props} bind:value={$formData.bio} />
    {/snippet}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
```