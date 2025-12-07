## Input OTP

Accessible one-time password component with copy-paste functionality.

```bash
npx shadcn-svelte@latest add input-otp -y -o
```

**Basic structure:**
```svelte
import * as InputOTP from "$lib/components/ui/input-otp/index.js";

<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

**Key features:**
- `maxlength` prop for OTP length
- `pattern` prop for validation (e.g., `REGEXP_ONLY_DIGITS_AND_CHARS` from bits-ui)
- `InputOTP.Separator` for visual grouping
- `aria-invalid` for error states
- Integrates with sveltekit-superforms for form validation