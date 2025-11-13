## Meter Component

Static measurement display within a known range. Value fluctuates based on real-time measurements (CPU, battery, volume).

**Basic Usage:**
```svelte
<Meter.Root value={2000} min={0} max={4000} aria-labelledby={labelId} aria-valuetext="2000 out of 4000">
  <div style="transform: translateX(-{100 - (100 * value) / max}%)"></div>
</Meter.Root>
```

**Props:** `value`, `min` (default 0), `max` (default 100), `ref`, `children`, `child`

**Accessibility:** Use `aria-labelledby` for visual labels or `aria-label` for text description. Set `aria-valuetext` for user-friendly value representation.