## Alert Component

Callout component for user attention messages.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add alert
```

### Usage
```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
</script>

<Alert.Root variant="destructive">
  <AlertCircleIcon />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
```

Supports `Alert.Root`, `Alert.Title`, `Alert.Description` with optional icons and `variant="destructive"` for error styling.