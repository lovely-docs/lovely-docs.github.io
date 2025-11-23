## Alert Component

Displays a callout for user attention with customizable variants and content.

### Installation

```bash
npx shadcn-svelte@latest add alert -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

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

### Component Structure

- `Alert.Root`: Container component
- `Alert.Title`: Title text
- `Alert.Description`: Description content
- Supports icon elements (from lucide-svelte or custom)

### Variants

**Default variant** - Standard alert styling:
```svelte
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>Success! Your changes have been saved</Alert.Title>
  <Alert.Description>This is an alert with icon, title and description.</Alert.Description>
</Alert.Root>
```

**Destructive variant** - Error/warning styling:
```svelte
<Alert.Root variant="destructive">
  <CircleAlertIcon class="size-4" />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
```

### Features

- Flexible composition: can include title only, description only, or both
- Icon support via slot (typically lucide-svelte icons)
- Rich content support in description (paragraphs, lists, etc.)
- Two built-in variants: default and destructive