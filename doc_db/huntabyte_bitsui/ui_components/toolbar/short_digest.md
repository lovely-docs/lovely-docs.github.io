## Toolbar Component

Displays frequently used actions in a compact bar.

### Basic Structure
```svelte
<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={myValue}>
    <Toolbar.GroupItem value="item-1" />
  </Toolbar.Group>
  <Toolbar.Button />
  <Toolbar.Link />
</Toolbar.Root>
```

### Key Props
- **Toolbar.Root**: `loop`, `orientation` ('horizontal' | 'vertical')
- **Toolbar.Group**: `type` ('single' | 'multiple'), `value` $bindable, `onValueChange`
- **Toolbar.GroupItem**: `value` required, `disabled`
- **Toolbar.Button/Link**: `disabled`, `ref` $bindable

### State Management
Use `bind:value` for two-way binding or function bindings for full control over reads/writes.