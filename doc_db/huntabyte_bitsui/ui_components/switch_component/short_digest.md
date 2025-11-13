## Switch Component

Toggle control for on/off states with accessibility support.

**Basic usage:**
```svelte
<Switch.Root bind:checked={myChecked}>
  <Switch.Thumb />
</Switch.Root>
```

**Form submission:**
```svelte
<Switch.Root name="dnd" value="custom-value" required />
```

**Key props:** `checked`, `disabled`, `name`, `value`, `required`

**Data attributes:** `data-state` ('checked'|'unchecked'), `data-checked`, `data-disabled`