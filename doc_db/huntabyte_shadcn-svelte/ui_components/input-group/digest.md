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

### Components

- `InputGroup.Root`: Container wrapper
- `InputGroup.Input`: Text input element
- `InputGroup.Textarea`: Multi-line text input
- `InputGroup.Addon`: Container for additional content (icons, text, buttons)
- `InputGroup.Text`: Text content within addons
- `InputGroup.Button`: Button element within addons

### Addon Alignment

The `align` prop on `InputGroup.Addon` controls positioning:
- `inline-end`: Right side (default for most cases)
- `block-end`: Bottom (for textarea)
- `block-start`: Top (for textarea)

### Examples

**Icons:**
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input type="email" placeholder="Enter your email" />
  <InputGroup.Addon>
    <MailIcon />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Card number" />
  <InputGroup.Addon align="inline-end">
    <StarIcon />
    <InfoIcon />
  </InputGroup.Addon>
</InputGroup.Root>
```

**Text:**
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

<InputGroup.Root>
  <InputGroup.Addon>
    <InputGroup.Text>https://</InputGroup.Text>
  </InputGroup.Addon>
  <InputGroup.Input placeholder="example.com" />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>.com</InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Enter your username" />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>@company.com</InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Textarea placeholder="Enter your message" />
  <InputGroup.Addon align="block-end">
    <InputGroup.Text class="text-muted-foreground text-xs">
      120 characters left
    </InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Buttons with Actions:**
```svelte
<script lang="ts">
  import { UseClipboard } from "$lib/hooks/use-clipboard.svelte.js";
  let isFavorite = $state(false);
  const clipboard = new UseClipboard();
</script>

<InputGroup.Root>
  <InputGroup.Input placeholder="https://x.com/shadcn" readonly />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button
      size="icon-xs"
      onclick={() => clipboard.copy("https://x.com/shadcn")}
    >
      {#if clipboard.copied}
        <CheckIcon />
      {:else}
        <CopyIcon />
      {/if}
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Type to search..." />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button variant="secondary">Search</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="@shadcn" />
  <InputGroup.Addon align="inline-end">
    <div class="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
      <CheckIcon class="size-3" />
    </div>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Tooltips:**
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

<InputGroup.Root>
  <InputGroup.Input placeholder="Your email address" />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" size="icon-xs">
            <HelpCircleIcon />
          </InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>We'll use this to send you notifications</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Textarea with Block Alignment:**
```svelte
<InputGroup.Root>
  <InputGroup.Addon align="block-start" class="border-b">
    <InputGroup.Text class="font-mono font-medium">script.js</InputGroup.Text>
    <InputGroup.Button class="ml-auto" size="icon-xs">
      <RefreshCwIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
  <InputGroup.Textarea placeholder="console.log('Hello, world!');" class="min-h-[200px]" />
  <InputGroup.Addon align="block-end" class="border-t">
    <InputGroup.Text>Line 1, Column 1</InputGroup.Text>
    <InputGroup.Button size="sm" class="ml-auto" variant="default">
      Run <CornerDownLeftIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Loading Indicators:**
```svelte
<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Searching..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Processing..." disabled />
  <InputGroup.Addon>
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Saving changes..." disabled />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>Saving...</InputGroup.Text>
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
```

**Labels:**
```svelte
<InputGroup.Root>
  <InputGroup.Input id="email" placeholder="shadcn" />
  <InputGroup.Addon>
    <Label.Root for="email">@</Label.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input id="email-2" placeholder="shadcn@vercel.com" />
  <InputGroup.Addon align="block-start">
    <Label.Root for="email-2" class="text-foreground">Email</Label.Root>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" class="ml-auto rounded-full" size="icon-xs">
            <InfoIcon />
          </InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>We'll use this to send you notifications</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Dropdown Menus:**
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter file name" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" size="icon-xs">
            <MoreHorizontalIcon />
          </InputGroup.Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item>Settings</DropdownMenu.Item>
        <DropdownMenu.Item>Copy path</DropdownMenu.Item>
        <DropdownMenu.Item>Open location</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root class="[--radius:1rem]">
  <InputGroup.Input placeholder="Enter search query" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" class="!pr-1.5 text-xs">
            Search In... <ChevronDownIcon class="size-3" />
          </InputGroup.Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" class="[--radius:0.95rem]">
        <DropdownMenu.Item>Documentation</DropdownMenu.Item>
        <DropdownMenu.Item>Blog Posts</DropdownMenu.Item>
        <DropdownMenu.Item>Changelog</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

**Button Group Integration:**
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

**Custom Input:**

Add the `data-slot="input-group-control"` attribute to custom input elements for automatic behavior and focus state handling. No styles are applied; use the `class` prop for styling.

```svelte
<InputGroup.Root>
  <textarea
    data-slot="input-group-control"
    class="field-sizing-content flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow] md:text-sm"
    placeholder="Autoresize textarea..."
  ></textarea>
  <InputGroup.Addon align="block-end">
    <InputGroup.Button class="ml-auto" size="sm" variant="default">
      Submit
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```