## Spinner

Loading state indicator component.

### Installation
```bash
npx shadcn-svelte@latest add spinner -y -o
```

### Basic Usage
```svelte
<Spinner />
```

### Customization & Examples

Customize size with `size-*` and color with `text-*` classes:
```svelte
<Spinner class="size-6 text-red-500" />
```

Use in buttons, badges, input groups, empty states, and item components:
```svelte
<Button disabled><Spinner /> Loading...</Button>
<Badge><Spinner /> Syncing</Badge>
<InputGroup.Addon><Spinner /></InputGroup.Addon>
<Item.Media><Spinner /></Item.Media>
```

Replace default icon by editing the component with a custom icon from lucide-svelte.