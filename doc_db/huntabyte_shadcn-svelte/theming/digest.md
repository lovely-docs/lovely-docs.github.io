## CSS Variables for Theming

shadcn-svelte uses CSS variables to customize component appearance. This allows changing colors without updating class names.

### Convention

Colors follow a `background` and `foreground` convention:
- `background` variable: component background color
- `foreground` variable: text color
- The `background` suffix is omitted in utility classes

Example:
```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

Used as:
```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

### Available CSS Variables

Default light/dark theme variables in `src/app.css`:

**Layout & Structure:**
- `--radius`: Border radius (default: 0.625rem)

**Base Colors:**
- `--background` / `--foreground`: Page background and text
- `--card` / `--card-foreground`: Card components
- `--popover` / `--popover-foreground`: Popover components

**Semantic Colors:**
- `--primary` / `--primary-foreground`: Primary actions
- `--secondary` / `--secondary-foreground`: Secondary actions
- `--muted` / `--muted-foreground`: Disabled/muted states
- `--accent` / `--accent-foreground`: Accent highlights
- `--destructive`: Destructive actions (red)

**UI Elements:**
- `--border`: Border color
- `--input`: Input field background
- `--ring`: Focus ring color

**Charts:**
- `--chart-1` through `--chart-5`: Chart colors

**Sidebar:**
- `--sidebar` / `--sidebar-foreground`: Sidebar background and text
- `--sidebar-primary` / `--sidebar-primary-foreground`: Sidebar primary
- `--sidebar-accent` / `--sidebar-accent-foreground`: Sidebar accent
- `--sidebar-border` / `--sidebar-ring`: Sidebar borders and rings

Colors use OKLCH format. Dark mode overrides are defined in `.dark` selector.

### Adding Custom Colors

Add new color variables to both `:root` and `.dark` selectors, then register with Tailwind:

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

Use as utility classes:
```svelte
<div class="bg-warning text-warning-foreground"></div>
```

### Preset Color Schemes

Pre-configured neutral color palettes available: Neutral, Stone, Zinc, Gray, Slate. Each includes light and dark mode variants with all standard variables configured.