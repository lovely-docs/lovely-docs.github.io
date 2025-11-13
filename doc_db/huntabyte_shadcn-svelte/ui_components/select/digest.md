## Select Component

A dropdown component that displays a list of options for users to pick from, triggered by a button.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add select
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
</script>

<Select.Root type="single">
  <Select.Trigger class="w-[180px]">Select a fruit</Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      <Select.Item value="apple" label="Apple">Apple</Select.Item>
      <Select.Item value="banana" label="Banana">Banana</Select.Item>
      <Select.Item value="grapes" label="Grapes" disabled>Grapes</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>
```

### Form Integration

Use with sveltekit-superforms and zod validation:

```svelte
<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <Select.Root type="single" bind:value={$formData.email} name={props.name}>
          <Select.Trigger {...props}>
            {$formData.email || "Select a verified email"}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="m@example.com" label="m@example.com" />
            <Select.Item value="m@google.com" label="m@google.com" />
          </Select.Content>
        </Select.Root>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

### Key Features

- Single or multiple selection modes via `type` prop
- Grouping options with `Select.Group` and `Select.Label`
- Disable individual items with `disabled` prop
- Bind selected value with `bind:value`
- Reactive trigger content using `$derived`
- Full form integration with validation support