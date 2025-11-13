## PIN Input Component

A customizable component for One-Time Password (OTP), Two-Factor Authentication (2FA), or Multi-Factor Authentication (MFA) input fields.

### Key Features
- Invisible input technique for seamless form submission and browser autofill
- Customizable appearance with full control over visual representation
- Keyboard navigation and screen reader accessibility
- Flexible configuration for various PIN lengths and input types

### Basic Structure
```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
</script>
<PinInput.Root maxlength={6}>
  {#snippet children({ cells })}
    {#each cells as cell}
      <PinInput.Cell {cell} />
    {/each}
  {/snippet}
</PinInput.Root>
```

### State Management
Two-way binding: `<PinInput.Root bind:value={myValue}>`

Fully controlled with function bindings:
```svelte
<PinInput.Root bind:value={getValue, setValue}>
```

### Paste Transformation
Sanitize pasted text with `pasteTransformer`:
```svelte
<PinInput.Root pasteTransformer={(text) => text.replace(/-/g, "")}>
```

### HTML Forms
Pass `name` prop for form submission. Use `onComplete` callback to submit when filled:
```svelte
<form method="POST" bind:this={form}>
  <PinInput.Root name="mfaCode" onComplete={() => form.submit()}>
</form>
```

### Input Patterns
Restrict input characters with `pattern` prop. Available patterns:
- `REGEXP_ONLY_DIGITS` - digits only
- `REGEXP_ONLY_CHARS` - characters only
- `REGEXP_ONLY_DIGITS_AND_CHARS` - both

```svelte
<PinInput.Root pattern={REGEXP_ONLY_DIGITS}>
```

### PinInput.Root Props
- `value` (bindable, string) - input value
- `onValueChange` (function) - called on value change
- `disabled` (boolean, default: false)
- `textalign` ('left' | 'center' | 'right', default: 'left')
- `maxlength` (number, default: 6)
- `onComplete` (function) - called when completely filled
- `pasteTransformer` (function) - sanitize pasted text
- `inputId` (string) - ID for hidden input element
- `pushPasswordManagerStrategy` ('increase-width' | 'none') - password manager badge positioning
- `ref` (bindable, HTMLDivElement)
- `children` (Snippet) - render cells

### PinInput.Cell Props
- `cell` (object) - cell data with `char`, `isActive`, `hasFakeCaret`
- `ref` (bindable, HTMLDivElement)
- `children` (Snippet)

### Data Attributes
- `data-pin-input-root` - on root element
- `data-active` - when cell is active
- `data-inactive` - when cell is inactive
- `data-pin-input-cell` - on cell element