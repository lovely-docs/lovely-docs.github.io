## Combobox

Searchable dropdown built from Popover + Command components. Requires both components installed.

**Basic example:**
```svelte
<Popover.Root bind:open>
  <Popover.Trigger>
    <Button role="combobox" aria-expanded={open}>
      {selectedValue || "Select..."}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root>
      <Command.Input placeholder="Search..." />
      <Command.List>
        <Command.Group>
          {#each items as item}
            <Command.Item value={item.value} onSelect={() => { value = item.value; }}>
              {item.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
```

**Form integration:** Wrap in Form.Field, use Form.Control as trigger wrapper, add hidden input with form value. Requires formsnap v0.5.0+.