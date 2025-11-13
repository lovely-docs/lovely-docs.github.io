## Radio Group

Mutually exclusive radio button component.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add radio-group
```

### Basic Usage
```svelte
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

### Form Integration
Bind to form state with `bind:value={$formData.fieldName}` and use with `Form.Control` and `Form.Fieldset` for validation.