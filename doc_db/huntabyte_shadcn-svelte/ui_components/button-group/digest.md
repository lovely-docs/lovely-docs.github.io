## Button Group Component

A container component that groups related buttons together with consistent styling and spacing.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add button-group
```

### Basic Usage
```svelte
<script lang="ts">
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<ButtonGroup.Root>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

### Key Features
- **Accessibility**: Has `role="group"`, supports `aria-label` or `aria-labelledby` for labeling
- **Orientation**: Set `orientation="vertical"` for vertical layout
- **Separator**: Use `ButtonGroup.Separator` to visually divide buttons (recommended for non-outline variants)
- **Nesting**: Can nest ButtonGroup components to create spaced groups
- **Size Control**: Use `size` prop on individual buttons (sm, default, lg, icon variants)

### Common Patterns
- **Split Button**: Combine button with separator and dropdown menu
- **Input Integration**: Wrap Input or InputGroup components with buttons
- **Dropdown Menu**: Create split buttons with DropdownMenu for additional actions
- **Select/Popover**: Pair with Select or Popover components for complex layouts

### ButtonGroup vs ToggleGroup
Use ButtonGroup for action buttons, use ToggleGroup for state-toggling buttons.