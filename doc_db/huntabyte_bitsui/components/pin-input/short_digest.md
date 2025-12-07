PIN input component for OTP/2FA/MFA with invisible input for form integration and autofill. Supports state binding, paste transformation, input patterns (digits/chars), and form submission. Customizable cells with keyboard/screen reader accessibility.

**Basic usage:**
```svelte
<PinInput.Root bind:value maxlength={6} pattern={REGEXP_ONLY_DIGITS}>
  {#snippet children({ cells })}
    {#each cells as cell}
      <PinInput.Cell {cell} />
    {/each}
  {/snippet}
</PinInput.Root>
```

**Key props:** `value`, `onComplete`, `pasteTransformer`, `pattern`, `disabled`, `textalign`, `maxlength`