## Field Component

Composable form field components with labels, descriptions, and error messages.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add field
```

### Core Components
`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldContent`, `FieldSeparator`, `FieldTitle`

### Orientations
- `vertical` (default) - stacks elements
- `horizontal` - side-by-side layout
- `responsive` - container-query based

### Validation
```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" aria-invalid />
  <Field.Error>Invalid email</Field.Error>
</Field.Field>
```

### Accessibility
Semantic HTML with `FieldSet`/`FieldLegend`, `role="group"` on Field, and screen reader support via `FieldSeparator`.