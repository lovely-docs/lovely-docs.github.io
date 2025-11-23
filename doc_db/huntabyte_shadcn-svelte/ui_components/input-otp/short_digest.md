## Input OTP

Accessible one-time password component with copy-paste functionality.

### Installation

```bash
npx shadcn-svelte@latest add input-otp -y -o
```

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

### Key Features

- **Pattern validation**: Use `pattern` prop with `REGEXP_ONLY_DIGITS_AND_CHARS` from bits-ui
- **Invalid state**: Apply `aria-invalid` attribute to slots
- **Form integration**: Works with sveltekit-superforms for validation and error handling
- **Customizable layout**: Use `InputOTP.Separator` to divide cells into groups