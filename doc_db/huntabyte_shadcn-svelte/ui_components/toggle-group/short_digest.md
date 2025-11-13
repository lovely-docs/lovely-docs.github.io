## Toggle Group

Two-state button group component. Install with `pnpm dlx shadcn-svelte@latest add toggle-group`.

```svelte
<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
</ToggleGroup.Root>
```

Props: `type` ("single" or "multiple"), `variant` ("outline"), `size` ("sm", "lg"), `disabled`.