## Switch Component

Toggle control for on/off states with WAI-ARIA support.

**Basic structure:**
```svelte
<Switch.Root bind:checked={state}>
  <Switch.Thumb />
</Switch.Root>
```

**State management:** Two-way binding with `bind:checked` or fully controlled with function binding.

**Disabled:** `<Switch.Root disabled />`

**Forms:** Use `name` prop for hidden input submission, optional `value` and `required` props.

**Data attributes:** `data-state` ('checked'|'unchecked'), `data-checked`, `data-disabled`, `data-switch-root` (Root) and `data-switch-thumb` (Thumb) for styling.

**Props:** Root has `checked`, `onCheckedChange`, `disabled`, `name`, `required`, `value`, `ref`, `children`, `child`. Thumb has `ref`, `children`, `child`.