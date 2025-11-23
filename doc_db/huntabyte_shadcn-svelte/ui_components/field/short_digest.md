## Field Component

Composable form field components for building accessible forms.

### Core Components

- `Field.Set`: Wrapper with optional legend and description
- `Field.Group`: Container to stack fields
- `Field.Field`: Individual field with `orientation` prop ("vertical", "horizontal", "responsive")
- `Field.Label`, `Field.Description`, `Field.Error`: Label, helper text, and error messages
- `Field.Legend`, `Field.Content`, `Field.Separator`, `Field.Title`: Semantic and layout helpers

### Installation

```bash
npx shadcn-svelte@latest add field -y -o
```

### Examples

**Input fields:**
```svelte
<Field.Set>
  <Field.Legend>Profile</Field.Legend>
  <Field.Group>
    <Field.Field>
      <Field.Label for="name">Full name</Field.Label>
      <Input id="name" placeholder="Evil Rabbit" />
      <Field.Description>This appears on invoices.</Field.Description>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

**Checkbox:**
```svelte
<Field.Field orientation="horizontal">
  <Checkbox id="sync" checked />
  <Field.Label for="sync" class="font-normal">Sync folders</Field.Label>
</Field.Field>
```

**Radio:**
```svelte
<Field.Set>
  <Field.Label>Plan</Field.Label>
  <RadioGroup.Root bind:value={plan}>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="monthly" id="monthly" />
      <Field.Label for="monthly" class="font-normal">Monthly</Field.Label>
    </Field.Field>
  </RadioGroup.Root>
</Field.Set>
```

**Switch:**
```svelte
<Field.Field orientation="horizontal">
  <Field.Content>
    <Field.Label for="2fa">Multi-factor authentication</Field.Label>
    <Field.Description>Enable 2FA for security.</Field.Description>
  </Field.Content>
  <Switch id="2fa" />
</Field.Field>
```

**Validation:**
```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

### Layouts

- **Vertical** (default): Stacks label, control, helper text
- **Horizontal**: `orientation="horizontal"` aligns label and control side-by-side
- **Responsive**: `orientation="responsive"` with `@container/field-group` for breakpoint-aware layouts

### Accessibility

- FieldSet and FieldLegend group related controls for keyboard/assistive tech users
- Field outputs `role="group"` for inherited labeling
- Use FieldSeparator sparingly for clear section boundaries