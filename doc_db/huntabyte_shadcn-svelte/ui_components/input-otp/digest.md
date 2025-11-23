## Input OTP

Accessible one-time password component with copy-paste functionality, built on Bits UI's PinInput component.

### Installation

```bash
npx shadcn-svelte@latest add input-otp -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
</script>

<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells.slice(0, 3) as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
    <InputOTP.Separator />
    <InputOTP.Group>
      {#each cells.slice(3, 6) as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

### Components

- **InputOTP.Root**: Container with `maxlength` prop to set OTP length
- **InputOTP.Group**: Groups cells together
- **InputOTP.Slot**: Individual input cell that receives `{cell}` prop
- **InputOTP.Separator**: Visual separator between groups

### Pattern Validation

Use the `pattern` prop to restrict input characters:

```svelte
<script lang="ts">
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
  import { REGEXP_ONLY_DIGITS_AND_CHARS } from "bits-ui";
</script>

<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

### Invalid State

Mark slots as invalid using the `aria-invalid` attribute:

```svelte
<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells.slice(0, 3) as cell (cell)}
        <InputOTP.Slot aria-invalid {cell} />
      {/each}
    </InputOTP.Group>
    <InputOTP.Separator />
    <InputOTP.Group>
      {#each cells.slice(3, 6) as cell (cell)}
        <InputOTP.Slot aria-invalid {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

### Form Integration

Integrate with sveltekit-superforms for validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    pin: z.string().min(6, {
      message: "Your one-time password must be at least 6 characters."
    })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
  import * as Form from "$lib/components/ui/form/index.js";

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
  <Form.Field {form} name="pin">
    <Form.Control>
      {#snippet children({ props })}
        <InputOTP.Root maxlength={6} {...props} bind:value={$formData.pin}>
          {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells as cell (cell)}
                <InputOTP.Slot {cell} />
              {/each}
            </InputOTP.Group>
          {/snippet}
        </InputOTP.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>Please enter the one-time password sent to your phone.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```