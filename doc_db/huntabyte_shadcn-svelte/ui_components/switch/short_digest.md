## Switch Component

Toggle control for boolean states.

### Installation
```bash
npx shadcn-svelte@latest add switch
```

### Basic Usage
```svelte
<Switch id="airplane-mode" />
<Label for="airplane-mode">Airplane Mode</Label>
```

### Form Integration
```svelte
<Form.Field {form} name="marketing_emails">
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>Marketing emails</Form.Label>
      <Switch {...props} bind:checked={$formData.marketing_emails} />
    {/snippet}
  </Form.Control>
</Form.Field>
```

Supports `disabled` and `aria-readonly` attributes.