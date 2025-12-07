## Input Group

Wraps inputs/textareas with adjacent addons for icons, text, buttons, tooltips, dropdowns, and loading states.

### Installation

```bash
npx shadcn-svelte@latest add input-group -y -o
```

### Basic Structure

```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="..." />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button>Action</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Key Components

- `InputGroup.Root`: Container
- `InputGroup.Input` / `InputGroup.Textarea`: Input elements
- `InputGroup.Addon`: Wrapper for icons, text, buttons (align: `inline-end`, `block-start`, `block-end`)
- `InputGroup.Text`: Text content
- `InputGroup.Button`: Buttons within addons

### Common Patterns

**Icons & Text:**
```svelte
<InputGroup.Root>
  <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon align="inline-end"><InputGroup.Text>12 results</InputGroup.Text></InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Addon><InputGroup.Text>$</InputGroup.Text></InputGroup.Addon>
  <InputGroup.Input placeholder="0.00" />
  <InputGroup.Addon align="inline-end"><InputGroup.Text>USD</InputGroup.Text></InputGroup.Addon>
</InputGroup.Root>
```

**Buttons with Actions:**
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="https://x.com/shadcn" readonly />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button onclick={() => clipboard.copy(...)}>
      {#if clipboard.copied}<CheckIcon />{:else}<CopyIcon />{/if}
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Tooltips & Dropdowns:**
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter password" type="password" />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger>{#snippet child({ props })}<InputGroup.Button {...props} size="icon-xs"><InfoIcon /></InputGroup.Button>{/snippet}</Tooltip.Trigger>
      <Tooltip.Content>Password must be at least 8 characters</Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Search query" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{#snippet child({ props })}<InputGroup.Button {...props}>Search In...</InputGroup.Button>{/snippet}</DropdownMenu.Trigger>
      <DropdownMenu.Content><DropdownMenu.Item>Documentation</DropdownMenu.Item></DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Textarea with Block Alignment:**
```svelte
<InputGroup.Root>
  <InputGroup.Addon align="block-start"><InputGroup.Text>script.js</InputGroup.Text></InputGroup.Addon>
  <InputGroup.Textarea placeholder="..." class="min-h-[200px]" />
  <InputGroup.Addon align="block-end">
    <InputGroup.Text>Line 1, Column 1</InputGroup.Text>
    <InputGroup.Button class="ml-auto">Run</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Loading States:**
```svelte
<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Searching..." disabled />
  <InputGroup.Addon align="inline-end"><Spinner /></InputGroup.Addon>
</InputGroup.Root>
```

**Custom Input:**
Add `data-slot="input-group-control"` to custom inputs for automatic behavior.