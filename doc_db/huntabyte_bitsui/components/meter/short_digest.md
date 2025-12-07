## Meter Component

Displays static measurements within a range (CPU, battery, volume). Unlike progress bars, values can fluctuate.

**Basic example:**
```svelte
<Meter.Root {value} {min} {max} aria-labelledby={labelId}>
  <div style="transform: translateX(-{100 - (100 * value) / max}%)"></div>
</Meter.Root>
```

**Props:** `value`, `min` (default 0), `max` (default 100), `ref`, `children`, `child`

**Data attributes:** `data-value`, `data-min`, `data-max`, `data-meter-root`

**Accessibility:** Use `aria-labelledby` with visual labels or `aria-label` alone; set `aria-valuetext` for clarity (e.g., "50% (6 hours) remaining")