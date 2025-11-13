## Toolbar Component

Displays frequently used actions or tools in a compact, accessible bar.

### Structure
```svelte
<Toolbar.Root>
  <Toolbar.Group>
    <Toolbar.GroupItem />
  </Toolbar.Group>
  <Toolbar.Link />
  <Toolbar.Button />
</Toolbar.Root>
```

### Managing Value State

**Two-Way Binding:**
```svelte
<script lang="ts">
  let myValue = $state("");
</script>
<Toolbar.Group type="single" bind:value={myValue}>
  <!-- items -->
</Toolbar.Group>
```

**Fully Controlled (Function Binding):**
```svelte
<script lang="ts">
  let myValue = $state("");
  function getValue() { return myValue; }
  function setValue(newValue: string) { myValue = newValue; }
</script>
<Toolbar.Group type="single" bind:value={getValue, setValue}>
  <!-- items -->
</Toolbar.Group>
```

### API Reference

**Toolbar.Root**
- `loop` (boolean, default: true) - Loop when navigating
- `orientation` ('horizontal' | 'vertical', default: 'horizontal')
- `ref` $bindable - HTMLDivElement reference
- Data attributes: `data-orientation`, `data-toolbar-root`

**Toolbar.Button**
- `disabled` (boolean, default: false)
- `ref` $bindable - HTMLButtonElement reference
- Data attribute: `data-toolbar-button`

**Toolbar.Link**
- `ref` $bindable - HTMLAnchorElement reference
- Data attribute: `data-toolbar-link`

**Toolbar.Group**
- `type` required ('single' | 'multiple') - Determines if value is string or string[]
- `value` $bindable (string | string[])
- `onValueChange` callback
- `disabled` (boolean, default: false)
- `ref` $bindable - HTMLDivElement reference
- Data attribute: `data-toolbar-group`

**Toolbar.GroupItem**
- `value` required (string) - Item's value
- `disabled` (boolean, default: false)
- `ref` $bindable - HTMLButtonElement reference
- Data attributes: `data-state` ('on' | 'off'), `data-value`, `data-disabled`, `data-toolbar-item`