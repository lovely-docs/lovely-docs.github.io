## Alert Component

A callout component for displaying user attention messages with optional icons, titles, and descriptions.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add alert
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
</script>

<Alert.Root>
  <Alert.Title>Heads up!</Alert.Title>
  <Alert.Description>
    You can add components to your app using the cli.
  </Alert.Description>
</Alert.Root>
```

### With Icon and Multiple Variants

```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
  import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
</script>

<!-- Success variant (default) -->
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>Success! Your changes have been saved</Alert.Title>
  <Alert.Description>This is an alert with icon, title and description.</Alert.Description>
</Alert.Root>

<!-- Destructive variant -->
<Alert.Root variant="destructive">
  <AlertCircleIcon />
  <Alert.Title>Unable to process your payment.</Alert.Title>
  <Alert.Description>
    <p>Please verify your billing information and try again.</p>
    <ul class="list-inside list-disc text-sm">
      <li>Check your card details</li>
      <li>Ensure sufficient funds</li>
      <li>Verify billing address</li>
    </ul>
  </Alert.Description>
</Alert.Root>
```

### Component Structure

- `Alert.Root` - Container component
- `Alert.Title` - Alert title (optional)
- `Alert.Description` - Alert description (optional)
- Supports icons via Lucide Svelte
- `variant="destructive"` for error/warning styling