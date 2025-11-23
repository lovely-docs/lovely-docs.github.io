## Input Group

Display additional information or actions adjacent to input or textarea elements.

### Installation

```bash
npx shadcn-svelte@latest add input-group -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import SearchIcon from "@lucide/svelte/icons/search";
</script>

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

### Core Components

- **InputGroup.Root**: Container wrapper
- **InputGroup.Input**: Text input field
- **InputGroup.Textarea**: Multi-line text input
- **InputGroup.Addon**: Container for additional content (icons, text, buttons)
- **InputGroup.Text**: Display text content
- **InputGroup.Button**: Action buttons within addons

### Addon Alignment

The `align` prop on `InputGroup.Addon` controls positioning:
- `inline-end`: Right side (default for inline content)
- `block-end`: Bottom (for textarea)
- `block-start`: Top (for textarea)

### Icon Addon

```svelte
<InputGroup.Root>
  <InputGroup.Input type="email" placeholder="Enter your email" />
  <InputGroup.Addon>
    <MailIcon />
  </InputGroup.Addon>
</InputGroup.Root>
```

### Text Addon

Display currency, domain prefixes, or status information:

```svelte
<InputGroup.Root>
  <InputGroup.Addon>
    <InputGroup.Text>$</InputGroup.Text>
  </InputGroup.Addon>
  <InputGroup.Input placeholder="0.00" />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>USD</InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Button Addon

```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="https://x.com/shadcn" readonly />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button size="icon-xs" onclick={() => clipboard.copy(...)}>
      <CopyIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Tooltip Integration

```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter password" type="password" />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" size="icon-xs">
            <InfoIcon />
          </InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>Password must be at least 8 characters</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Textarea with Block Addons

Use `block-start` and `block-end` alignment for textarea:

```svelte
<InputGroup.Root>
  <InputGroup.Addon align="block-start" class="border-b">
    <InputGroup.Text>script.js</InputGroup.Text>
    <InputGroup.Button class="ml-auto" size="icon-xs">
      <RefreshCwIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
  <InputGroup.Textarea placeholder="console.log('Hello, world!');" />
  <InputGroup.Addon align="block-end" class="border-t">
    <InputGroup.Text>Line 1, Column 1</InputGroup.Text>
    <InputGroup.Button size="sm" class="ml-auto">Run</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Loading State

```svelte
<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Searching..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
```

### Dropdown Integration

```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter search query" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost">
            Search In... <ChevronDownIcon class="size-3" />
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

### Label Integration

```svelte
<InputGroup.Root>
  <InputGroup.Input id="email" placeholder="shadcn" />
  <InputGroup.Addon>
    <Label.Root for="email">@</Label.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Button Group Wrapper

Combine with ButtonGroup for complex layouts:

```svelte
<ButtonGroup.Root>
  <ButtonGroup.Text>
    <Label.Root for="url">https://</Label.Root>
  </ButtonGroup.Text>
  <InputGroup.Root>
    <InputGroup.Input id="url" />
    <InputGroup.Addon align="inline-end">
      <Link2Icon />
    </InputGroup.Addon>
  </InputGroup.Root>
  <ButtonGroup.Text>.com</ButtonGroup.Text>
</ButtonGroup.Root>
```

### Custom Input

Add `data-slot="input-group-control"` to custom input elements for automatic behavior and focus state handling:

```svelte
<InputGroup.Root>
  <textarea
    data-slot="input-group-control"
    class="field-sizing-content flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow]"
    placeholder="Autoresize textarea..."
  ></textarea>
  <InputGroup.Addon align="block-end">
    <InputGroup.Button class="ml-auto" size="sm" variant="default">
      Submit
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

No styles are applied to custom inputs; apply your own using the `class` prop.