## Accordion

Collapsible sections component with single/multiple open modes.

**Basic structure:**
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

**Key features:** Single/multiple mode, accessible, smooth transitions, disabled items, horizontal orientation, hidden-until-found search support.

**State management:** Two-way binding with `bind:value` or fully controlled with function binding.

**Transitions:** Use `forceMount` with `child` snippet for Svelte transitions.

**Examples:** Horizontal cards with images, multi-step checkout form.

**API:** Root (type, value, disabled, loop, orientation), Item (value, disabled), Header (level), Trigger, Content (forceMount, hiddenUntilFound). Data attributes for state/orientation/disabled. CSS variables for content dimensions.