## Input Group

Component for displaying additional information or actions alongside inputs and textareas.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add input-group
```

### Basic Usage
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

### Key Components
- `InputGroup.Root` - Container wrapper
- `InputGroup.Input` - Text input field
- `InputGroup.Textarea` - Multi-line text input
- `InputGroup.Addon` - Container for prefix/suffix content with `align` prop (`inline-end`, `block-start`, `block-end`)
- `InputGroup.Button` - Action button within addon
- `InputGroup.Text` - Static text content

### Common Patterns

**Icons**: Place icons in addons for visual indicators
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
</InputGroup.Root>
```

**Text Prefix/Suffix**: Use `InputGroup.Text` for currency, domain, or unit indicators
```svelte
<InputGroup.Root>
  <InputGroup.Addon><InputGroup.Text>$</InputGroup.Text></InputGroup.Addon>
  <InputGroup.Input placeholder="0.00" />
  <InputGroup.Addon align="inline-end"><InputGroup.Text>USD</InputGroup.Text></InputGroup.Addon>
</InputGroup.Root>
```

**Buttons**: Add interactive buttons for actions like copy, search, or submit
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="https://x.com/shadcn" readonly />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button onclick={() => clipboard.copy(...)}>
      <CopyIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Tooltips**: Wrap buttons with Tooltip component for help text
```svelte
<InputGroup.Addon align="inline-end">
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <InputGroup.Button {...props} size="icon-xs">
          <InfoIcon />
        </InputGroup.Button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>Password must be at least 8 characters</Tooltip.Content>
  </Tooltip.Root>
</InputGroup.Addon>
```

**Textarea with Block Alignment**: Use `block-start` or `block-end` for vertical alignment
```svelte
<InputGroup.Root>
  <InputGroup.Addon align="block-start">
    <InputGroup.Text>script.js</InputGroup.Text>
  </InputGroup.Addon>
  <InputGroup.Textarea placeholder="..." class="min-h-[200px]" />
  <InputGroup.Addon align="block-end">
    <InputGroup.Text>Line 1, Column 1</InputGroup.Text>
    <InputGroup.Button class="ml-auto">Run</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Loading States**: Use Spinner component for async operations
```svelte
<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Searching..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
```

**Dropdowns**: Integrate with DropdownMenu for complex selections
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter search query" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost">
            Search In... <ChevronDownIcon />
          </InputGroup.Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item>Documentation</DropdownMenu.Item>
        <DropdownMenu.Item>Blog Posts</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Custom Input**: Use `data-slot="input-group-control"` attribute on custom inputs for automatic focus state handling
```svelte
<InputGroup.Root>
  <textarea
    data-slot="input-group-control"
    class="flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5"
    placeholder="Autoresize textarea..."
  ></textarea>
  <InputGroup.Addon align="block-end">
    <InputGroup.Button class="ml-auto" size="sm">Submit</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Button Groups**: Wrap with ButtonGroup component to create cohesive prefix/suffix sections
```svelte
<ButtonGroup.Root>
  <ButtonGroup.Text><Label.Root>https://</Label.Root></ButtonGroup.Text>
  <InputGroup.Root>
    <InputGroup.Input />
    <InputGroup.Addon align="inline-end"><Link2Icon /></InputGroup.Addon>
  </InputGroup.Root>
  <ButtonGroup.Text>.com</ButtonGroup.Text>
</ButtonGroup.Root>
```