## Chart Component

Copy-paste chart components built on LayerChart. Composition-based: use LayerChart components directly, add custom components like `Chart.Tooltip` only when needed.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add chart
```

### Basic Example
```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { BarChart } from "layerchart";
  
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
  ];
  
  const chartConfig = {
    desktop: { label: "Desktop", color: "#2563eb" },
    mobile: { label: "Mobile", color: "#60a5fa" },
  } satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig}>
  <BarChart data={chartData} x="month" series={[
    { key: "desktop", label: chartConfig.desktop.label, color: chartConfig.desktop.color },
    { key: "mobile", label: chartConfig.mobile.label, color: chartConfig.mobile.color },
  ]}>
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

### Chart Config
Decoupled from data. Supports icons and theme objects with light/dark variants.

### Theming
Use CSS variables or direct colors (hex, hsl, oklch). Reference: `color: "var(--chart-1)"` or `fill="var(--color-desktop)"`

### Tooltip Props
`labelKey`, `nameKey`, `indicator` (`dot`|`line`|`dashed`), `hideLabel`, `hideIndicator`, `labelFormatter`, `formatter`