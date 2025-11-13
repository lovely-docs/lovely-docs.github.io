## Tabs Component

A tabbed interface component for displaying layered sections of content (tab panels) one at a time.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add tabs
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
</script>

<Tabs.Root value="account" class="w-[400px]">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    Make changes to your account here.
  </Tabs.Content>
  <Tabs.Content value="password">
    Change your password here.
  </Tabs.Content>
</Tabs.Root>
```

### Structure

- `Tabs.Root` - Container with initial `value` prop
- `Tabs.List` - Container for tab triggers
- `Tabs.Trigger` - Individual tab button with `value` prop
- `Tabs.Content` - Panel content associated with a trigger `value`

### Full Example with Card Integration

Combine tabs with Card, Button, Input, and Label components for a complete form interface with multiple sections (Account and Password tabs with input fields and save buttons).