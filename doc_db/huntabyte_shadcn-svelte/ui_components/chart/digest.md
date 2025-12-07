## Chart Component

Beautiful, composable charts built on LayerChart. Copy-paste components into your apps.

**Important:** LayerChart v2 is in pre-release with potential breaking changes. Track development at the LayerChart PR #449.

### Installation

```bash
npx shadcn-svelte@latest add chart -y -o
```

Flags: `-y` skips confirmation, `-o` overwrites existing files.

### Core Concept

Charts use composition with LayerChart components. You build charts using LayerChart's components and only import custom components like `ChartTooltip` when needed. LayerChart is not wrapped, so you're not locked into an abstraction and can follow official upgrade paths.

```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { BarChart } from "layerchart";
  const data = [/* ... */];
</script>
<Chart.Container>
  <BarChart {data} x="date" y="value">
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

### Building Your First Chart

**1. Define data** (any shape; use `dataKey` prop to map):
```ts
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  // ...
];
```

**2. Define chart config** (labels, icons, colors):
```ts
const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
  mobile: { label: "Mobile", color: "#60a5fa" },
} satisfies Chart.ChartConfig;
```

**3. Build chart with LayerChart components**:
```svelte
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
    props={{
      xAxis: { format: (d) => d.slice(0, 3) }
    }}
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

### Chart Config

Decoupled from chart data. Holds labels, icons, and colors. Supports theme objects with light/dark variants:

```ts
const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: MonitorIcon,
    color: "#2563eb",
    // OR theme object:
    theme: { light: "#2563eb", dark: "#dc2626" }
  }
} satisfies Chart.ChartConfig;
```

### Theming

**CSS Variables (recommended)**:
```css
:root {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
}
.dark {
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
}
```

Reference in config:
```ts
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" }
} satisfies Chart.ChartConfig;
```

Use in components: `<Bar fill="var(--color-desktop)" />`

Use in data: `{ browser: "chrome", visitors: 275, color: "var(--color-chrome)" }`

Use in Tailwind: `<Label class="fill-(--color-desktop)" />`

Also supports hex, hsl, oklch directly in config.

### Tooltip Component

`<Chart.Tooltip>` customizes tooltips with label, name, indicator, and value.

**Props**:
- `labelKey` (string): Config/data key for label
- `nameKey` (string): Config/data key for name
- `indicator` (`dot` | `line` | `dashed`): Indicator style
- `hideLabel` (boolean): Hide label
- `hideIndicator` (boolean): Hide indicator
- `label` (string): Custom label
- `labelFormatter` (function): Format label
- `formatter` (Snippet): Custom tooltip rendering

**Example with custom keys**:
```svelte
<script lang="ts">
  const chartData = [
    { browser: "chrome", visitors: 187 },
    { browser: "safari", visitors: 200 }
  ];
  const chartConfig = {
    visitors: { label: "Total Visitors" },
    chrome: { label: "Chrome", color: "var(--chart-1)" },
    safari: { label: "Safari", color: "var(--chart-2)" }
  } satisfies ChartConfig;
</script>
<Chart.Tooltip labelKey="visitors" nameKey="browser" />
```

Colors are automatically referenced from chart config.