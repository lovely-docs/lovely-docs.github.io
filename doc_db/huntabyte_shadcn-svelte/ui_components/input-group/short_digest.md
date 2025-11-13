## Input Group

Component for adding prefixes, suffixes, and actions to inputs/textareas.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add input-group
```

### Basic Usage
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
  <InputGroup.Addon align="inline-end"><InputGroup.Button>Search</InputGroup.Button></InputGroup.Addon>
</InputGroup.Root>
```

### Components
- `InputGroup.Root` - Container
- `InputGroup.Input` / `InputGroup.Textarea` - Input fields
- `InputGroup.Addon` - Prefix/suffix container with `align` prop (`inline-end`, `block-start`, `block-end`)
- `InputGroup.Button` - Action button
- `InputGroup.Text` - Static text

### Examples
**Icons, text, buttons, tooltips, spinners, dropdowns, custom inputs, button groups**