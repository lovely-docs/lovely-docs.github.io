## Textarea Component

Install with:
```bash
npx shadcn-svelte@latest add textarea -y -o
```

Import and use:
```svelte
<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<Textarea placeholder="Type your message here." />
```

Supports `disabled` attribute, can be paired with Label component, and integrates with Form component for validation using sveltekit-superforms and Zod.