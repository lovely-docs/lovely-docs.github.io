## Select Component

Displays a dropdown list of options for users to pick from, triggered by a button.

### Installation

```bash
npx shadcn-svelte@latest add select -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
</script>

<Select.Root type="single">
  <Select.Trigger class="w-[180px]">Select an option</Select.Trigger>
  <Select.Content>
    <Select.Item value="light">Light</Select.Item>
    <Select.Item value="dark">Dark</Select.Item>
    <Select.Item value="system">System</Select.Item>
  </Select.Content>
</Select.Root>
```

### Key Components

- `Select.Root`: Container with `type="single"` for single selection, accepts `name` and `bind:value` for form binding
- `Select.Trigger`: Button that opens the dropdown
- `Select.Content`: Container for dropdown items
- `Select.Group`: Groups related items
- `Select.Label`: Labels for item groups
- `Select.Item`: Individual selectable item with `value`, `label`, and optional `disabled` props

### Dynamic Options Example

```svelte
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  
  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" }
  ];
  
  let value = $state("");
  const triggerContent = $derived(
    fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
  );
</script>

<Select.Root type="single" name="favoriteFruit" bind:value>
  <Select.Trigger class="w-[180px]">
    {triggerContent}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      {#each fruits as fruit (fruit.value)}
        <Select.Item
          value={fruit.value}
          label={fruit.label}
          disabled={fruit.value === "grapes"}
        >
          {fruit.label}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
```

### Form Integration

Integrate with sveltekit-superforms and Zod validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    email: z.email({ message: "Please select an email to display" })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <Select.Root
          type="single"
          bind:value={$formData.email}
          name={props.name}
        >
          <Select.Trigger {...props}>
            {$formData.email ?? "Select a verified email to display"}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="m@example.com" label="m@example.com" />
            <Select.Item value="m@google.com" label="m@google.com" />
            <Select.Item value="m@support.com" label="m@support.com" />
          </Select.Content>
        </Select.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>
      You can manage email addresses in your email settings.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

Reference the Bits UI documentation for full API reference and additional options.