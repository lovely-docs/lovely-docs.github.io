## Chart Component

Beautiful, copy-paste chart components built on LayerChart. Charts are designed to look great out of the box and work well with other components.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add chart
```

### Key Concepts

**Composition-based design**: Build charts using LayerChart components directly. Only import custom components like `Chart.Tooltip` when needed. You're not locked into an abstraction—when LayerChart updates, follow the official upgrade path.

### Basic Setup

1. **Define data**: Any shape works; use `dataKey` prop to map to chart
2. **Create chart config**: Holds labels, icons, and color tokens
3. **Build chart**: Use LayerChart components (e.g., `BarChart`) wrapped in `Chart.Container`

```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { scaleBand } from "d3-scale";
  import { BarChart } from "layerchart";
  
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
  ];
  
  const chartConfig = {
    desktop: { label: "Desktop", color: "#2563eb" },
    mobile: { label: "Mobile", color: "#60a5fa" },
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
      { key: "mobile", label: chartConfig.mobile.label, color: chartConfig.mobile.color },
    ]}
    props={{ xAxis: { format: (d) => d.slice(0, 3) } }}
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

### Chart Config

Decoupled from data, allowing config/color token reuse. Supports icons and theme objects with light/dark variants:

```svelte
const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: MonitorIcon,
    theme: { light: "#2563eb", dark: "#dc2626" },
  },
} satisfies Chart.ChartConfig;
```

### Theming

Use CSS variables (recommended) or direct color values (hex, hsl, oklch):

```css
:root {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
}
```

Reference in config: `color: "var(--chart-1)"` or use in components: `fill="var(--color-desktop)"`

### Tooltip

`Chart.Tooltip` component with customizable props:

| Prop | Type | Description |
|------|------|-------------|
| `labelKey` | string | Config/data key for label |
| `nameKey` | string | Config/data key for name |
| `indicator` | `dot` \| `line` \| `dashed` | Indicator style |
| `hideLabel` | boolean | Hide label |
| `hideIndicator` | boolean | Hide indicator |
| `labelFormatter` | function | Format label |
| `formatter` | Snippet | Custom tooltip rendering |

Colors auto-reference from chart config. Use custom keys with `labelKey` and `nameKey` props.