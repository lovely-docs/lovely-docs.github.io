## Chart Component

Composable charts built on LayerChart. Install with `npx shadcn-svelte@latest add chart -y -o`.

**Core**: Build charts using LayerChart components, import custom components like `ChartTooltip` only when needed. Not wrapped, so you follow official upgrade paths.

**Basic example**:
```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { BarChart } from "layerchart";
  const chartData = [{ month: "January", desktop: 186, mobile: 80 }, ...];
  const chartConfig = {
    desktop: { label: "Desktop", color: "#2563eb" },
    mobile: { label: "Mobile", color: "#60a5fa" }
  } satisfies Chart.ChartConfig;
</script>
<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
  <BarChart
    data={chartData}
    xScale={scaleBand().padding(0.25)}
    x="month"
    axis="x"
    seriesLayout="group"
    series={[
      { key: "desktop", label: chartConfig.desktop.label, color: chartConfig.desktop.color },
      { key: "mobile", label: chartConfig.mobile.label, color: chartConfig.mobile.color }
    ]}
    props={{ xAxis: { format: (d) => d.slice(0, 3) } }}
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

**Theming**: Use CSS variables (`--chart-1`, `--chart-2`, etc.) or hex/hsl/oklch colors. Reference with `var(--chart-1)` in config, `var(--color-KEY)` in components/data.

**Tooltip**: `<Chart.Tooltip>` with props `labelKey`, `nameKey`, `indicator` (dot|line|dashed), `hideLabel`, `hideIndicator`, `label`, `labelFormatter`, `formatter`.