## Command Component

Searchable, filterable command menu with keyboard navigation, grouping, and grid layout support.

### Basic Usage
```svelte
<Command.Root>
  <Command.Input placeholder="Search..." />
  <Command.List>
    <Command.Viewport>
      <Command.Empty>No results</Command.Empty>
      <Command.Group>
        <Command.GroupHeading>Group</Command.GroupHeading>
        <Command.GroupItems>
          <Command.Item keywords={["alias"]}>Item</Command.Item>
        </Command.GroupItems>
      </Command.Group>
    </Command.Viewport>
  </Command.List>
</Command.Root>
```

### State Management
- **Two-way binding:** `bind:value={myValue}`
- **Change handler:** `onValueChange={(value) => {}}`
- **Fully controlled:** `bind:value={() => myValue, (v) => myValue = v}`

### Key Features
- Custom filtering: `filter={(value, search, keywords) => score}` (0-1)
- Disable filtering: `shouldFilter={false}`
- Grid layout: `columns={8}`
- Keyboard nav: vim bindings (ctrl+n/j/p/k), arrow keys, Enter
- Modal: wrap in `Dialog` component
- Links: use `Command.LinkItem` for anchor elements
- Item selection: `onSelect={() => {}}`

### Imperative API
```svelte
let command;
command.getValidItems() // array of selectable items
command.updateSelectedToIndex(2) // select item at index
command.updateSelectedByGroup(1) // next group
command.updateSelectedByItem(1) // next item
```

### Important
- Each `Command.Item` must have unique `value`
- Use `keywords` prop for additional search terms
- `Command.Viewport` sets `--bits-command-list-height` CSS variable
- Data attributes: `data-selected`, `data-disabled`, `data-command-*`