## Tabs Component

Layered content sections displayed one at a time.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add tabs
```

### Usage
```svelte
<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
</script>

<Tabs.Root value="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">Account content</Tabs.Content>
  <Tabs.Content value="password">Password content</Tabs.Content>
</Tabs.Root>
```

Components: `Tabs.Root` (container), `Tabs.List` (trigger container), `Tabs.Trigger` (tab button), `Tabs.Content` (panel).