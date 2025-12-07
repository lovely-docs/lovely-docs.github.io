## Select Component

Dropdown list component for picking from options.

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
  <Select.Trigger>Select option</Select.Trigger>
  <Select.Content>
    <Select.Item value="light">Light</Select.Item>
    <Select.Item value="dark">Dark</Select.Item>
  </Select.Content>
</Select.Root>
```

### With State & Grouping
```svelte
<script lang="ts">
  let value = $state("");
  const items = [{ value: "apple", label: "Apple" }];
  const triggerContent = $derived(items.find(i => i.value === value)?.label ?? "Select");
</script>

<Select.Root type="single" bind:value>
  <Select.Trigger>{triggerContent}</Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      {#each items as item}
        <Select.Item value={item.value} label={item.label} disabled={false}>
          {item.label}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
```

### Form Integration
Use with sveltekit-superforms for validation and error handling. Bind `$formData.fieldName` to `Select.Root` value, pass form props to `Select.Trigger`, and use `Form.FieldErrors` for validation messages.