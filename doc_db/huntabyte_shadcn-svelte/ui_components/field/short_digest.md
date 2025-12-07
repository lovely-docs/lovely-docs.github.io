# Field Component

Composable form field components for accessible forms with labels, controls, help text, and validation.

## Installation

```bash
npx shadcn-svelte@latest add field -y -o
```

## Core Components

`Field`, `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldContent`, `FieldSeparator`, `FieldTitle`

## Orientation

- Default (vertical): stacks label, control, helper text
- `orientation="horizontal"`: side-by-side with `FieldContent` for aligned descriptions
- `orientation="responsive"`: automatic column layouts with container queries

## Examples

**Basic input:**
```svelte
<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" placeholder="Max Leiter" />
      <Field.Description>Choose a unique username.</Field.Description>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

**Fieldset with multiple fields:**
```svelte
<Field.Set>
  <Field.Legend>Address Information</Field.Legend>
  <Field.Description>We need your address to deliver your order.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="street">Street Address</Field.Label>
      <Input id="street" placeholder="123 Main St" />
    </Field.Field>
    <div class="grid grid-cols-2 gap-4">
      <Field.Field>
        <Field.Label for="city">City</Field.Label>
        <Input id="city" placeholder="New York" />
      </Field.Field>
      <Field.Field>
        <Field.Label for="zip">Postal Code</Field.Label>
        <Input id="zip" placeholder="90502" />
      </Field.Field>
    </div>
  </Field.Group>
</Field.Set>
```

**Horizontal checkbox/radio/switch:**
```svelte
<Field.Field orientation="horizontal">
  <Checkbox id="newsletter" />
  <Field.Label for="newsletter">Subscribe to the newsletter</Field.Label>
</Field.Field>

<Field.Field orientation="horizontal">
  <RadioGroup.Item value="monthly" id="plan-monthly" />
  <Field.Label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</Field.Label>
</Field.Field>

<Field.Field orientation="horizontal">
  <Field.Content>
    <Field.Label for="2fa">Multi-factor authentication</Field.Label>
    <Field.Description>Enable for added security.</Field.Description>
  </Field.Content>
  <Switch id="2fa" />
</Field.Field>
```

**Choice card (selectable field groups):**
```svelte
<Field.Label for="kubernetes">
  <Field.Field orientation="horizontal">
    <Field.Content>
      <Field.Title>Kubernetes</Field.Title>
      <Field.Description>Run GPU workloads on a K8s cluster.</Field.Description>
    </Field.Content>
    <RadioGroup.Item value="kubernetes" id="kubernetes" />
  </Field.Field>
</Field.Label>
```

**Validation:**
```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

## Accessibility

`FieldSet`/`FieldLegend` group controls for keyboard/assistive tech. `Field` outputs `role="group"`. Use `FieldSeparator` sparingly.
