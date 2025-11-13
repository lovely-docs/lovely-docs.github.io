## Input Component

Form input field component supporting text, email, file types and more.

### Installation
```bash
npm install shadcn-svelte@latest add input
```

### Usage
```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<Input type="email" placeholder="email" />
```

### Examples
- **Disabled:** `<Input disabled type="email" />`
- **With label:** Wrap with Label component
- **With helper text:** Add `<p>` below input
- **With button:** Combine in form with Button component
- **Invalid state:** Use `aria-invalid` attribute
- **File input:** `<Input type="file" />`
- **Form validation:** Integrate with sveltekit-superforms and zod for schema validation