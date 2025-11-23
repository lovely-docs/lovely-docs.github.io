## CSS Variables Theming

shadcn-svelte uses CSS variables with `background`/`foreground` convention for colors. Utility classes omit the `background` suffix:

```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

**Core variables:** `--radius`, `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1` through `--chart-5`, `--sidebar` variants.

Colors use OKLCH format with dark mode overrides in `.dark` selector.

**Add custom colors:**
```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}
.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Use as: `<div class="bg-warning text-warning-foreground"></div>`

Preset schemes available: Neutral, Stone, Zinc, Gray, Slate.