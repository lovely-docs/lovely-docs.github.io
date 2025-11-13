## Command Component

A searchable, filterable menu component for quick navigation and action execution.

### Key Features
- Dynamic filtering with customizable scoring algorithm
- Full keyboard navigation support (arrow keys, vim bindings with ctrl+n/j/p/k)
- Grouped commands with headers
- Empty and loading states
- Accessibility with ARIA attributes
- Grid layout support via `columns` prop

### Architecture
Sub-components: `Root` (state manager), `Input` (search field), `List` (container), `Viewport` (visible area with CSS variables), `Empty`, `Loading`, `Group`, `GroupHeading`, `GroupItems`, `Item`, `LinkItem`, `Separator`

### State Management
Three approaches:
1. Two-way binding: `bind:value={myValue}`
2. Change handler: `onValueChange={(value) => { /* ... */ }}`
3. Fully controlled: `bind:value={() => myValue, (newValue) => (myValue = newValue)}`

### Filtering
- Default: scoring algorithm that sorts by relevance
- Custom filter: return number 0-1 (1 = perfect match, 0 = hidden)
- Disable: `shouldFilter={false}` for custom logic
- Extend default: import and use `computeCommandScore` function

```svelte
function customFilter(commandValue, search, commandKeywords) {
  return commandValue.includes(search) ? 1 : 0;
}
<Command.Root filter={customFilter}>
```

### Selection & Links
- `onSelect` callback on items: `<Command.Item onSelect={() => console.log("selected")} />`
- Use `Command.LinkItem` for link-based items (renders `<a>` for prefetching)

### Imperative API
Bind to `Command.Root` to access methods:
- `getValidItems()` - returns array of selectable items
- `updateSelectedToIndex(index)` - set selection by index
- `updateSelectedByGroup(1 | -1)` - move to next/previous group
- `updateSelectedByItem(1 | -1)` - move to next/previous item

```svelte
let command;
<Command.Root bind:this={command}>
command.updateSelectedToIndex(2);
```

### Common Mistakes
- Duplicate `value` props on items cause selection issues. Use unique values: `<Command.Item value="item-1">My Item</Command.Item>`

### Examples
Modal integration with keyboard shortcut (Cmd+J):
```svelte
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger>Open Command Menu ⌘J</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Command.Root>
        <Command.Input placeholder="Search..." />
        <Command.List>
          <Command.Viewport>
            <Command.Group>
              <Command.GroupHeading>Suggestions</Command.GroupHeading>
              <Command.GroupItems>
                <Command.Item value="intro" keywords={["getting started"]}>
                  Introduction
                </Command.Item>
              </Command.GroupItems>
            </Command.Group>
          </Command.Viewport>
        </Command.List>
      </Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

Grid layout with emoji picker:
```svelte
<Command.Root columns={8}>
  <Command.Input bind:value={search} />
  <Command.List>
    <Command.Viewport>
      <Command.Group>
        <Command.GroupHeading>Pinned</Command.GroupHeading>
        <Command.GroupItems class="grid grid-cols-8 gap-2">
          <Command.Item value="shrug">🤷‍♂️</Command.Item>
          <Command.Item value="check">✅</Command.Item>
        </Command.GroupItems>
      </Command.Group>
    </Command.Viewport>
  </Command.List>
</Command.Root>
```