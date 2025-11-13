## CSS Variables Convention

shadcn-svelte uses CSS variables for styling. Colors follow a `background` and `foreground` convention where the `background` suffix is omitted for component backgrounds.

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

## Available Variables

Core variables in `:root` and `.dark`:
- Layout: `--radius`, `--background`, `--foreground`
- Components: `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`
- UI: `--border`, `--input`, `--ring`
- Charts: `--chart-1` through `--chart-5`
- Sidebar: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`

Colors use OKLCH format and have separate light/dark mode values.

## Adding Custom Colors

Add to CSS file with both light and dark variants:

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

Then use: `<div class="bg-warning text-warning-foreground"></div>`

## Base Color Palettes

Pre-configured palettes available: Neutral, Stone, Zinc, Gray, Slate. Each includes full light/dark mode variable sets.