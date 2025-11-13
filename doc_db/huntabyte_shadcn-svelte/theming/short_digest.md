## CSS Variables & Convention

Colors use `background`/`foreground` convention in OKLCH format:
```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```
```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

## Core Variables

`:root` and `.dark` include: `--radius`, `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1` to `--chart-5`, sidebar variants.

## Custom Colors

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

Use: `<div class="bg-warning text-warning-foreground"></div>`

Pre-configured palettes: Neutral, Stone, Zinc, Gray, Slate.