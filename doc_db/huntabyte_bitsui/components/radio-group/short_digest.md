## Radio Group

Groups radio items for form submission. Supports two-way binding, form integration, disabled/readonly states, and vertical/horizontal orientation with keyboard navigation.

**Basic example:**
```svelte
<RadioGroup.Root bind:value={myValue} name="choice">
  <RadioGroup.Item value="a"><Label for="a">Option A</Label></RadioGroup.Item>
  <RadioGroup.Item value="b"><Label for="b">Option B</Label></RadioGroup.Item>
</RadioGroup.Root>
```

**Key props:** `value` (bindable), `onValueChange`, `disabled`, `readonly`, `required`, `name`, `orientation` ('vertical'|'horizontal'), `loop`

**Item props:** `value` (required), `disabled`

**Data attributes:** `data-state` (checked|unchecked), `data-disabled`, `data-readonly`, `data-orientation`