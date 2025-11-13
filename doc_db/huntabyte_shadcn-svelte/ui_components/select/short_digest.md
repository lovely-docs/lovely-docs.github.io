## Select Component

Dropdown component for picking from a list of options.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add select
```

### Basic Usage
```svelte
<Select.Root type="single">
  <Select.Trigger>Select a fruit</Select.Trigger>
  <Select.Content>
    <Select.Item value="apple" label="Apple">Apple</Select.Item>
    <Select.Item value="banana" label="Banana">Banana</Select.Item>
  </Select.Content>
</Select.Root>
```

### Form Integration
```svelte
<Select.Root type="single" bind:value={$formData.email} name={props.name}>
  <Select.Trigger {...props}>{$formData.email || "Select email"}</Select.Trigger>
  <Select.Content>
    <Select.Item value="m@example.com" label="m@example.com" />
  </Select.Content>
</Select.Root>
```

Supports grouping, disabled items, and form validation.