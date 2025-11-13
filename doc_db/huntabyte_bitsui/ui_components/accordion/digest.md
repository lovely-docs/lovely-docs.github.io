## Accordion Component

Organizes content into collapsible sections. Supports single or multiple open items simultaneously.

### Quick Start
```svelte
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Collapsible content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Structure
- `Accordion.Root`: Container managing overall state
- `Accordion.Item`: Individual collapsible section
- `Accordion.Header`: Contains the visible heading
- `Accordion.Trigger`: Clickable element toggling visibility
- `Accordion.Content`: Collapsible body content

### Key Features
- **Single or Multiple Mode**: `type="single"` allows one open section; `type="multiple"` allows multiple
- **Accessible**: Built-in ARIA attributes and keyboard navigation
- **Smooth Transitions**: Use `forceMount` with `child` snippet for Svelte transitions
- **Flexible State**: Uncontrolled defaults or full control with `bind:value`
- **Disabled Items**: Set `disabled` prop on items
- **Browser Search**: `hiddenUntilFound` prop enables search within collapsed content

### State Management
Two-way binding:
```svelte
<script>
  let myValue = $state<string[]>([]);
</script>
<Accordion.Root type="multiple" bind:value={myValue}>
```

Fully controlled with function binding:
```svelte
<Accordion.Root type="single" bind:value={getValue, setValue}>
```

### Transitions with Svelte
```svelte
<Accordion.Content forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:slide={{ duration: 1000 }}>
        Content
      </div>
    {/if}
  {/snippet}
</Accordion.Content>
```

### Reusable Components
Create wrapper components for repeated patterns. Item wrapper combines Item, Header, Trigger, and Content. Root wrapper renders multiple items from an array.

### Customization
- `type`: "single" or "multiple"
- `value`: Pre-open items
- `disabled`: Disable specific items
- `orientation`: "vertical" (default) or "horizontal"
- `loop`: Loop through items with keyboard navigation

### API Reference
**Accordion.Root** properties: `type` (required), `value` (bindable), `onValueChange`, `disabled`, `loop`, `orientation`, `ref` (bindable)

**Accordion.Item** properties: `disabled`, `value`, `ref` (bindable)

**Accordion.Header** properties: `level` (1-6, default 3), `ref` (bindable)

**Accordion.Trigger** properties: `ref` (bindable)

**Accordion.Content** properties: `forceMount`, `hiddenUntilFound`, `ref` (bindable)

Data attributes available: `data-state`, `data-disabled`, `data-orientation`, `data-accordion-*`

CSS variables: `--bits-accordion-content-height`, `--bits-accordion-content-width`