## Button Group

Container component that groups related buttons with consistent styling.

### Installation

```bash
npx shadcn-svelte@latest add button-group -y -o
```

### Basic Usage

```svelte
<ButtonGroup.Root>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

### Key Features

- **Accessibility**: Automatic `role="group"`, use `aria-label` for labeling
- **Orientation**: Set `orientation="vertical"` for vertical layout
- **Separator**: Use `ButtonGroup.Separator` to divide buttons
- **Nesting**: Nest groups to create spaced button collections
- **Integrations**: Works with Input, InputGroup, DropdownMenu, Select, Popover

### Common Patterns

**Split Button with Dropdown**:
```svelte
<ButtonGroup.Root>
  <Button variant="outline">Follow</Button>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline"><ChevronDown /></Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content><!-- items --></DropdownMenu.Content>
  </DropdownMenu.Root>
</ButtonGroup.Root>
```

**With Input**:
```svelte
<ButtonGroup.Root>
  <Input placeholder="Search..." />
  <Button variant="outline" size="icon"><Search /></Button>
</ButtonGroup.Root>
```

**Nested Groups**:
```svelte
<ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button>1</Button>
    <Button>2</Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button size="icon"><ArrowLeft /></Button>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

Use ButtonGroup for action buttons, ToggleGroup for state toggles.