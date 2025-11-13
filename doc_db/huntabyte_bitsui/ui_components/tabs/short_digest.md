## Tabs Component

Organizes content into tabbed sections.

```svelte
<Tabs.Root bind:value={activeTab}>
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">Content</Tabs.Content>
</Tabs.Root>
```

**Key props:**
- `orientation`: `'horizontal'` | `'vertical'` - controls keyboard navigation
- `activationMode`: `'automatic'` | `'manual'` - focus vs press to activate
- `disabled`, `loop` - disable tabs or wrap keyboard navigation