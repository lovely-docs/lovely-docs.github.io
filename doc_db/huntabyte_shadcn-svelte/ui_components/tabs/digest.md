## Tabs Component

A tabbed interface component that displays multiple sections of content (tab panels) with only one visible at a time.

### Installation

```bash
npx shadcn-svelte@latest add tabs -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import the Tabs component:

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
  <Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root>
```

### Component Structure

- **Tabs.Root**: Container component that accepts a `value` prop to set the active tab
- **Tabs.List**: Container for tab triggers
- **Tabs.Trigger**: Individual tab button with a `value` prop that must match a corresponding Tabs.Content
- **Tabs.Content**: Panel content that displays when its corresponding trigger is active

### Complete Example with Card Integration

```svelte
<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex w-full max-w-sm flex-col gap-6">
  <Tabs.Root value="account">
    <Tabs.List>
      <Tabs.Trigger value="account">Account</Tabs.Trigger>
      <Tabs.Trigger value="password">Password</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="account">
      <Card.Root>
        <Card.Header>
          <Card.Title>Account</Card.Title>
          <Card.Description>
            Make changes to your account here. Click save when you're done.
          </Card.Description>
        </Card.Header>
        <Card.Content class="grid gap-6">
          <div class="grid gap-3">
            <Label for="tabs-demo-name">Name</Label>
            <Input id="tabs-demo-name" value="Pedro Duarte" />
          </div>
          <div class="grid gap-3">
            <Label for="tabs-demo-username">Username</Label>
            <Input id="tabs-demo-username" value="@peduarte" />
          </div>
        </Card.Content>
        <Card.Footer>
          <Button>Save changes</Button>
        </Card.Footer>
      </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="password">
      <Card.Root>
        <Card.Header>
          <Card.Title>Password</Card.Title>
          <Card.Description>
            Change your password here. After saving, you'll be logged out.
          </Card.Description>
        </Card.Header>
        <Card.Content class="grid gap-6">
          <div class="grid gap-3">
            <Label for="tabs-demo-current">Current password</Label>
            <Input id="tabs-demo-current" type="password" />
          </div>
          <div class="grid gap-3">
            <Label for="tabs-demo-new">New password</Label>
            <Input id="tabs-demo-new" type="password" />
          </div>
        </Card.Content>
        <Card.Footer>
          <Button>Save password</Button>
        </Card.Footer>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</div>
```

### API Reference

Full API documentation available in the Bits UI Tabs documentation and API reference.