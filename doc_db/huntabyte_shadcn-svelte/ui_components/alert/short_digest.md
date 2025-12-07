## Alert

Displays a callout for user attention.

### Installation

```bash
npx shadcn-svelte@latest add alert -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
</script>

<!-- Basic -->
<Alert.Root>
  <Alert.Title>Heads up!</Alert.Title>
  <Alert.Description>You can add components to your app using the cli.</Alert.Description>
</Alert.Root>

<!-- With icon -->
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>Success! Your changes have been saved</Alert.Title>
  <Alert.Description>This is an alert with icon, title and description.</Alert.Description>
</Alert.Root>

<!-- Destructive variant -->
<Alert.Root variant="destructive">
  <CheckCircle2Icon />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
```

Components: `Alert.Root`, `Alert.Title`, `Alert.Description` (optional). Variants: default, `destructive`.