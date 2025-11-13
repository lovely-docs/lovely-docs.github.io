## Field Component

Composable form field components for building accessible forms with labels, controls, and help text.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add field
```

### Core Components
- `Field` - wrapper for a single field
- `FieldLabel` - label element with `for` attribute
- `FieldDescription` - helper/hint text
- `FieldError` - validation error message
- `FieldGroup` - container for related fields
- `FieldSet` - semantic grouping with `FieldLegend`
- `FieldContent` - flex column grouping label and description
- `FieldSeparator` - divider between field groups
- `FieldTitle` - title for choice cards

### Orientations
- `orientation="vertical"` (default) - stacks label, control, and helper text
- `orientation="horizontal"` - aligns label and control side-by-side
- `orientation="responsive"` - automatic column layouts with container queries

### Validation
Add `data-invalid` to `Field` and `aria-invalid` to the input:
```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

### Examples
Works with Input, Textarea, Select, Slider, Checkbox, Radio, and Switch components. Supports choice cards by wrapping `Field` inside `FieldLabel` with radio/checkbox controls.

### Accessibility
- `FieldSet` and `FieldLegend` group related controls for keyboard and assistive tech
- `Field` outputs `role="group"` for inherited labeling
- `FieldSeparator` marks clear section boundaries for screen readers