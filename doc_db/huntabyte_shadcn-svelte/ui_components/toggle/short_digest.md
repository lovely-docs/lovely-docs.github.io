## Toggle Component

Two-state button that toggles between on/off.

**Installation**: `npm install shadcn-svelte@latest add toggle`

**Basic usage**:
```svelte
<Toggle>Toggle</Toggle>
```

**Props**: `variant` ("default" | "outline"), `size` ("sm" | "lg"), `disabled`, `aria-label`

**Examples**:
- Icon: `<Toggle aria-label="toggle bold"><BoldIcon class="size-4" /></Toggle>`
- With text: `<Toggle><ItalicIcon class="mr-2 size-4" />Italic</Toggle>`
- Disabled: `<Toggle disabled>...</Toggle>`