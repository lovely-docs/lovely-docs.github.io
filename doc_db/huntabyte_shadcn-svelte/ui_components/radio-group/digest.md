## Radio Group

A set of mutually exclusive radio buttons where only one button can be checked at a time.

### Installation

```bash
npx shadcn-svelte@latest add radio-group -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import the RadioGroup components and Label:

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
</script>

<RadioGroup.Root value="option-one">
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="option-one" id="option-one" />
    <Label for="option-one">Option One</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="option-two" id="option-two" />
    <Label for="option-two">Option Two</Label>
  </div>
</RadioGroup.Root>
```

The `RadioGroup.Root` component wraps the radio buttons and manages the selected value. Each `RadioGroup.Item` represents a single radio button option with a corresponding label.

### Form Integration

RadioGroup integrates with sveltekit-superforms for form handling:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    type: z.enum(["all", "mentions", "none"])
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";

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
  <Form.Fieldset {form} name="type" class="space-y-3">
    <Form.Legend>Notify me about...</Form.Legend>
    <RadioGroup.Root
      bind:value={$formData.type}
      class="flex flex-col space-y-1"
      name="type"
    >
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control>
          {#snippet children({ props })}
            <RadioGroup.Item value="all" {...props} />
            <Form.Label class="font-normal">All new messages</Form.Label>
          {/snippet}
        </Form.Control>
      </div>
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control>
          {#snippet children({ props })}
            <RadioGroup.Item value="mentions" {...props} />
            <Form.Label class="font-normal">Direction messages and mentions</Form.Label>
          {/snippet}
        </Form.Control>
      </div>
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control>
          {#snippet children({ props })}
            <RadioGroup.Item value="none" {...props} />
            <Form.Label class="font-normal">Nothing</Form.Label>
          {/snippet}
        </Form.Control>
      </div>
    </RadioGroup.Root>
    <Form.FieldErrors />
  </Form.Fieldset>
  <Form.Button>Submit</Form.Button>
</form>
```

Bind the RadioGroup value to form data using `bind:value={$formData.fieldName}`. Wrap items with `Form.Control` and `Form.Label` for proper form integration. Use `Form.FieldErrors` to display validation errors.