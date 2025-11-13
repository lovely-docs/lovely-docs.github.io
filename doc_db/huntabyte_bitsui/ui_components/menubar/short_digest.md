## Menubar

Horizontal bar with multiple dropdown menus. Each menu can contain items, checkboxes, radio buttons, and nested submenus.

**Checkbox items:**
```svelte
<Menubar.CheckboxGroup bind:value={colors}>
  <Menubar.CheckboxItem value="red">Red</Menubar.CheckboxItem>
</Menubar.CheckboxGroup>
```

**Radio items:**
```svelte
<Menubar.RadioGroup bind:value={selected}>
  <Menubar.RadioItem value="table">Table</Menubar.RadioItem>
</Menubar.RadioGroup>
```

**Nested menus:**
```svelte
<Menubar.Sub>
  <Menubar.SubTrigger>Find</Menubar.SubTrigger>
  <Menubar.SubContent>
    <Menubar.Item>Search</Menubar.Item>
  </Menubar.SubContent>
</Menubar.Sub>
```

**Control active menu:**
```svelte
<Menubar.Root bind:value={activeValue}>
  <Menubar.Menu value="menu-1">...</Menubar.Menu>
</Menubar.Root>
```