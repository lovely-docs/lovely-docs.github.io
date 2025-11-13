## Checkbox Component

Toggle control for checked/unchecked states.

**Installation:** `npm install shadcn-svelte@latest add checkbox`

**Basic:** `<Checkbox />` with optional `checked` and `disabled` props

**With Label:**
```svelte
<Checkbox id="terms" />
<Label for="terms">Accept terms</Label>
```

**Form Integration:**
```svelte
<Checkbox
  checked={$formData.items.includes(item.id)}
  onCheckedChange={(v) => v ? addItem(id) : removeItem(id)}
/>
```

**Styling:** Use `class` prop with `data-[state=checked]` selectors