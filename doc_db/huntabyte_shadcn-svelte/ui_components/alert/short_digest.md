## Alert Component

Displays callouts for user attention.

### Installation

```bash
npx shadcn-svelte@latest add alert -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
</script>

<Alert.Root>
  <Alert.Title>Heads up!</Alert.Title>
  <Alert.Description>You can add components to your app using the cli.</Alert.Description>
</Alert.Root>
```

### Variants

**Default:**
```svelte
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>Success! Your changes have been saved</Alert.Title>
  <Alert.Description>This is an alert with icon, title and description.</Alert.Description>
</Alert.Root>
```

**Destructive:**
```svelte
<Alert.Root variant="destructive">
  <CircleAlertIcon class="size-4" />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
```

Supports icons, flexible title/description combinations, and rich content in descriptions.