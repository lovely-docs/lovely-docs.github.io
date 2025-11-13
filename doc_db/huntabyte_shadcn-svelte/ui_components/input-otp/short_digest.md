## Input OTP

Accessible one-time password component with copy-paste functionality.

### Installation

```bash
npm install shadcn-svelte@latest add input-otp
```

### Basic Usage

```svelte
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

### Key Features

- `pattern` prop for input validation (e.g., `REGEXP_ONLY_DIGITS_AND_CHARS`)
- `aria-invalid` for error states
- `InputOTP.Separator` for visual grouping
- Form integration with sveltekit-superforms