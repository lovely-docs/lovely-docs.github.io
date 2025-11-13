## Progress Component

Shows task completion status (value only increases).

**Basic Usage:**
```svelte
<Progress.Root value={50} max={100} />
```

**Props:** `max` (default 100), `min` (default 0), `value` (null = indeterminate), `ref`, `children`, `child`

**Data Attributes:** `data-value`, `data-state` ('indeterminate'|'determinate'), `data-min`, `data-max`, `data-indeterminate`, `data-progress-root`

**Accessibility:** Use `aria-labelledby` with visual label or `aria-label` without one.

**vs Meter:** Progress tracks completion; Meter shows static measurements that fluctuate.