## Input Component

Form input field supporting text, email, file types and more.

### Installation

```bash
npx shadcn-svelte@latest add input -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<Input type="email" placeholder="email" />
```

### Examples

- **Default:** `<Input type="email" placeholder="email" />`
- **Disabled:** `<Input disabled type="email" placeholder="email" />`
- **With label:** Wrap with Label component using `for` attribute
- **With helper text:** Add `<p>` below input with helper message
- **With button:** Combine in form with Button component for subscribe pattern
- **Invalid state:** Use `aria-invalid` attribute
- **File input:** `<Input type="file" />`
- **Form validation:** Integrate with sveltekit-superforms and zod for schema validation and error handling