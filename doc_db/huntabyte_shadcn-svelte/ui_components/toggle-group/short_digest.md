## Toggle Group

Two-state button group component. Install with `npx shadcn-svelte@latest add toggle-group -y -o`.

**Basic usage:**
```svelte
<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
</ToggleGroup.Root>
```

**Props:** `type` ("single" or "multiple"), `variant` ("outline"), `size` ("sm", default, "lg"), `disabled` (boolean)