A loading indicator component that displays an animated spinning icon.

**Installation:**
```bash
pnpm dlx shadcn-svelte@latest add spinner
```

**Basic usage:**
```svelte
import { Spinner } from "$lib/components/ui/spinner/index.js";
<Spinner />
```

**Customization:**
- Size: Use `size-*` utility classes (e.g., `size-3`, `size-4`, `size-6`, `size-8`)
- Color: Use `text-*` utility classes (e.g., `text-red-500`, `text-blue-500`)
- Replace the default icon by editing the component to use a different icon from lucide-svelte

**Common use cases:**
- Inside buttons: `<Button disabled><Spinner /> Loading...</Button>`
- Inside badges: `<Badge><Spinner /> Syncing</Badge>`
- Inside input groups: `<InputGroup.Addon><Spinner /></InputGroup.Addon>`
- Inside empty states: `<Empty.Media variant="icon"><Spinner /></Empty.Media>`
- Inside item lists: `<Item.Media variant="icon"><Spinner /></Item.Media>`