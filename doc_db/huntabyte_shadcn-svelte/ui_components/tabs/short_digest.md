## Tabs Component

Tabbed interface displaying one content panel at a time.

### Installation

```bash
npx shadcn-svelte@latest add tabs -y -o
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
  <Tabs.Content value="account">Make changes to your account here.</Tabs.Content>
  <Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root>
```

### Components

- **Tabs.Root**: Container with `value` prop for active tab
- **Tabs.List**: Trigger container
- **Tabs.Trigger**: Tab button with `value` matching content
- **Tabs.Content**: Panel displayed when trigger is active