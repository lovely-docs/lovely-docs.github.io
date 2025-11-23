## Input Group

Display additional information or actions adjacent to inputs/textareas.

### Installation

```bash
npx shadcn-svelte@latest add input-group -y -o
```

### Basic Structure

```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button>Search</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Components

- **InputGroup.Root**: Container
- **InputGroup.Input**: Text input
- **InputGroup.Textarea**: Multi-line input
- **InputGroup.Addon**: Content container (align: `inline-end`, `block-start`, `block-end`)
- **InputGroup.Text**: Text display
- **InputGroup.Button**: Action buttons

### Common Patterns

**Icons**: `<InputGroup.Addon><SearchIcon /></InputGroup.Addon>`

**Text**: `<InputGroup.Addon><InputGroup.Text>$</InputGroup.Text></InputGroup.Addon>`

**Buttons**: `<InputGroup.Addon align="inline-end"><InputGroup.Button>Search</InputGroup.Button></InputGroup.Addon>`

**Tooltips**: Wrap `InputGroup.Button` in `Tooltip.Root`/`Tooltip.Trigger`

**Textarea with headers/footers**: Use `align="block-start"` and `align="block-end"`

**Loading**: Add `data-disabled` to root and use `<Spinner />`

**Dropdowns**: Wrap `InputGroup.Button` in `DropdownMenu.Root`/`DropdownMenu.Trigger`

**Custom inputs**: Add `data-slot="input-group-control"` attribute for automatic behavior