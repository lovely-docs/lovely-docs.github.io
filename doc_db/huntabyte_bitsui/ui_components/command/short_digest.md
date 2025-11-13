## Command Component

Searchable, filterable menu with keyboard navigation, grouping, and grid layout support.

### State Management
- Two-way: `bind:value={myValue}`
- Handler: `onValueChange={(value) => {}}`
- Controlled: `bind:value={() => myValue, (v) => (myValue = v)}`

### Filtering
- Default: relevance scoring
- Custom: `filter={(value, search, keywords) => 0-1}`
- Disable: `shouldFilter={false}`

### Selection & Links
- `<Command.Item onSelect={() => {}} />`
- `<Command.LinkItem href="/path" />` for links

### Imperative API
```svelte
let command;
<Command.Root bind:this={command}>
command.getValidItems()
command.updateSelectedToIndex(2)
command.updateSelectedByItem(1)
```

### Examples
Modal with Cmd+J:
```svelte
<Dialog.Root bind:open={dialogOpen}>
  <Command.Root>
    <Command.Input placeholder="Search..." />
    <Command.List>
      <Command.Viewport>
        <Command.Group>
          <Command.GroupHeading>Suggestions</Command.GroupHeading>
          <Command.GroupItems>
            <Command.Item value="intro">Introduction</Command.Item>
          </Command.GroupItems>
        </Command.Group>
      </Command.Viewport>
    </Command.List>
  </Command.Root>
</Dialog.Root>
```

Grid layout:
```svelte
<Command.Root columns={8}>
  <Command.GroupItems class="grid grid-cols-8">
    <Command.Item value="emoji">🎉</Command.Item>
  </Command.GroupItems>
</Command.Root>
```

### Important
- Use unique `value` props on items to avoid selection issues