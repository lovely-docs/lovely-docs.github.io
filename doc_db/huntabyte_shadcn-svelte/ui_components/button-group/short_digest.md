## Button Group

Container for grouping related buttons with consistent styling.

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
- **Accessibility**: `role="group"`, use `aria-label` for labeling
- **Orientation**: `orientation="vertical"` for vertical layout
- **Separator**: `ButtonGroup.Separator` divides buttons visually
- **Composable**: Works with Input, InputGroup, DropdownMenu, Select, Popover
- **Nesting**: Nest ButtonGroup components for spacing
- **Sizes**: Control with `size` prop (sm, default, lg, icon variants)

### Common Patterns
- Split button with separator and dropdown menu
- Input with search button
- Pagination controls (numbered buttons with prev/next)
- Complex input layouts with nested groups