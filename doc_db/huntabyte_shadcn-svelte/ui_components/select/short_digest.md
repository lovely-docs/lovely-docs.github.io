## Select Component

Dropdown list component for single option selection.

### Installation

```bash
npx shadcn-svelte@latest add select -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
</script>

<Select.Root type="single">
  <Select.Trigger>Select an option</Select.Trigger>
  <Select.Content>
    <Select.Item value="light">Light</Select.Item>
    <Select.Item value="dark">Dark</Select.Item>
  </Select.Content>
</Select.Root>
```

### Key Components

- `Select.Root`: Container with `type="single"`, supports `bind:value` and `name`
- `Select.Trigger`: Opens dropdown
- `Select.Content`: Dropdown container
- `Select.Item`: Individual option with `value`, `label`, and optional `disabled`
- `Select.Group` / `Select.Label`: Group and label items

### Form Integration

```svelte
<Select.Root type="single" bind:value={$formData.email} name="email">
  <Select.Trigger>{$formData.email ?? "Select email"}</Select.Trigger>
  <Select.Content>
    <Select.Item value="m@example.com" label="m@example.com" />
  </Select.Content>
</Select.Root>
```

Works with sveltekit-superforms and Zod validation.