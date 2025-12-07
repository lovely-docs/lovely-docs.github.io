## CSS Variable Theming

Uses `background`/`foreground` convention with OKLCH colors. Default variables include primary, secondary, accent, destructive, border, input, ring, chart colors, and sidebar variants.

Add custom colors:
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

Pre-configured themes: Neutral, Stone, Zinc, Gray, Slate.