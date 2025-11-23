## Button Group

A container component that groups related buttons together with consistent styling and spacing.

### Installation

```bash
npx shadcn-svelte@latest add button-group -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

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

### Accessibility

- The component has `role="group"` set automatically
- Use `tabindex` to navigate between buttons
- Label with `aria-label` or `aria-labelledby`:

```svelte
<ButtonGroup.Root aria-label="Button group">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

### ButtonGroup vs ToggleGroup

- **ButtonGroup**: Group buttons that perform actions
- **ToggleGroup**: Group buttons that toggle state

### Orientation

Set `orientation="vertical"` for vertical layout:

```svelte
<ButtonGroup.Root orientation="vertical" aria-label="Media controls" class="h-fit">
  <Button variant="outline" size="icon"><Plus /></Button>
  <Button variant="outline" size="icon"><Minus /></Button>
</ButtonGroup.Root>
```

### Size

Control button sizes using the `size` prop on individual buttons (sm, default, lg, icon-sm, icon, icon-lg):

```svelte
<ButtonGroup.Root>
  <Button variant="outline" size="sm">Small</Button>
  <Button variant="outline">Default</Button>
  <Button variant="outline" size="lg">Large</Button>
</ButtonGroup.Root>
```

### Nested Groups

Nest `ButtonGroup` components to create groups with spacing:

```svelte
<ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline" size="sm">1</Button>
    <Button variant="outline" size="sm">2</Button>
    <Button variant="outline" size="sm">3</Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline" size="icon-sm" aria-label="Previous"><ArrowLeft /></Button>
    <Button variant="outline" size="icon-sm" aria-label="Next"><ArrowRight /></Button>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

### Separator

Use `ButtonGroup.Separator` to visually divide buttons. Recommended for non-outline variants:

```svelte
<ButtonGroup.Root>
  <Button variant="secondary" size="sm">Copy</Button>
  <ButtonGroup.Separator />
  <Button variant="secondary" size="sm">Paste</Button>
</ButtonGroup.Root>
```

### Split Button

Create a split button with a separator and icon button:

```svelte
<ButtonGroup.Root>
  <Button variant="secondary">Button</Button>
  <ButtonGroup.Separator />
  <Button variant="secondary" size="icon"><Plus /></Button>
</ButtonGroup.Root>
```

### With Input

Wrap an `Input` component with buttons:

```svelte
<ButtonGroup.Root>
  <Input placeholder="Search..." />
  <Button variant="outline" size="icon" aria-label="Search"><Search /></Button>
</ButtonGroup.Root>
```

### With InputGroup

Create complex input layouts with `InputGroup`:

```svelte
<ButtonGroup.Root class="[--radius:9999rem]">
  <ButtonGroup.Root>
    <Button variant="outline" size="icon"><Plus /></Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <InputGroup.Root>
      <InputGroup.Input placeholder="Send a message..." />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Button size="icon-xs" aria-pressed={voiceEnabled}>
          <AudioLines />
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

### With DropdownMenu

Create a split button with dropdown menu:

```svelte
<ButtonGroup.Root>
  <Button variant="outline">Follow</Button>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="!pl-2">
          <ChevronDown />
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item><VolumeOff />Mute Conversation</DropdownMenu.Item>
      <DropdownMenu.Item><Check />Mark as Read</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item variant="destructive"><Trash />Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</ButtonGroup.Root>
```

### With Select

Pair with a `Select` component:

```svelte
<ButtonGroup.Root>
  <ButtonGroup.Root>
    <Select.Root type="single" bind:value={currency}>
      <Select.Trigger class="font-mono">{currency}</Select.Trigger>
      <Select.Content>
        <Select.Item value="$">$ US Dollar</Select.Item>
        <Select.Item value="€">€ Euro</Select.Item>
      </Select.Content>
    </Select.Root>
    <Input placeholder="10.00" />
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button size="icon" variant="outline"><ArrowRight /></Button>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

### With Popover

Use with a `Popover` component:

```svelte
<ButtonGroup.Root>
  <Button variant="outline"><Bot />Copilot</Button>
  <Popover.Root>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" size="icon"><ChevronDown /></Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content align="end" class="rounded-xl p-0">
      <div class="px-4 py-3">Agent Tasks</div>
      <Separator />
      <div class="p-4"><Textarea placeholder="Describe your task..." /></div>
    </Popover.Content>
  </Popover.Root>
</ButtonGroup.Root>
```