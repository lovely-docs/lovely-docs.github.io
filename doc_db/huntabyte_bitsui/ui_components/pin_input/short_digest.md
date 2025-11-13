## PIN Input Component

Customizable OTP/2FA/MFA input component with invisible input technique for form integration and autofill support.

### Basic Usage
```svelte
<PinInput.Root maxlength={6} bind:value={myValue}>
  {#snippet children({ cells })}
    {#each cells as cell}
      <PinInput.Cell {cell} />
    {/each}
  {/snippet}
</PinInput.Root>
```

### Key Props
- `value` (bindable) - input value
- `maxlength` (default: 6)
- `onComplete` - callback when filled
- `pattern` - restrict input (REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS)
- `pasteTransformer` - sanitize pasted text
- `name` - for HTML form submission
- `disabled` (default: false)

### Form Integration
```svelte
<form method="POST" bind:this={form}>
  <PinInput.Root name="mfaCode" onComplete={() => form.submit()}>
</form>
```

### Data Attributes
- `data-pin-input-root` - root element
- `data-active` / `data-inactive` - cell states
- `data-pin-input-cell` - cell element