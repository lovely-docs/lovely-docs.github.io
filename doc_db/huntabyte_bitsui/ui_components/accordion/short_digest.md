## Accordion Component

Collapsible sections with single or multiple open items.

### Quick Start
```svelte
<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Key Props
- `type`: "single" or "multiple"
- `value`: Currently open item(s), bindable
- `disabled`: Disable accordion or items
- `orientation`: "vertical" or "horizontal"
- `forceMount`: Mount content for transitions
- `hiddenUntilFound`: Enable browser search in collapsed content

### State Management
```svelte
let myValue = $state<string[]>([]);
<Accordion.Root type="multiple" bind:value={myValue}>
```

### Transitions
```svelte
<Accordion.Content forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:slide>Content</div>
    {/if}
  {/snippet}
</Accordion.Content>
```

### Components
Root, Item, Header, Trigger, Content