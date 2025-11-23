## Chart

Beautiful, customizable charts built on LayerChart. Copy and paste into your apps.

**Important:** LayerChart v2 is in pre-release and actively evolving. Only use if comfortable with potential breaking changes. Track development status on GitHub.

### Installation

```bash
npx shadcn-svelte@latest add chart -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Component Design

Charts use composition with LayerChart components. You build charts using LayerChart components and only bring in custom components like `ChartTooltip` when needed. LayerChart is not wrapped, so you're not locked into an abstraction and can follow official upgrade paths.

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

Define data in any shape using `dataKey` prop to map to the chart:

```ts
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  // ...
];
```

Define chart config with labels, icons, and colors:

```ts
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies Chart.ChartConfig;
```

Build chart using LayerChart's simplified components (e.g., `BarChart`):

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
  />
</Chart.Container>
```

### Customizing Axis Ticks

Use `props` prop to pass custom props to chart components. Format x-axis ticks:

```svelte
<BarChart
  {data}
  {/* ... */}
  props={{
    xAxis: {
      format: (d) => d.slice(0, 3),
    },
  }}
/>
```

### Adding Tooltip

Replace `tooltip={false}` with `tooltip` snippet containing `Chart.Tooltip`:

```svelte
<BarChart {data} {/* ... */}>
  {#snippet tooltip()}
    <Chart.Tooltip />
  {/snippet}
</BarChart>
```

### Adding Legend

Set `legend` prop to `true`:

```svelte
<BarChart {data} {/* ... */} legend>
  {#snippet tooltip()}
    <Chart.Tooltip />
  {/snippet}
</BarChart>
```

## Chart Config

Chart config holds labels, icons, and colors. Intentionally decoupled from chart data to share config and color tokens between charts.

```ts
const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: MonitorIcon,
    color: "#2563eb",
    // OR theme object with 'light' and 'dark' keys
    theme: {
      light: "#2563eb",
      dark: "#dc2626",
    },
  },
} satisfies Chart.ChartConfig;
```

## Theming

### CSS Variables (Recommended)

Define colors in CSS:

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

Add to chart config:

```ts
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies Chart.ChartConfig;
```

### Direct Color Values

Use hex, hsl, or oklch directly:

```ts
const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
} satisfies Chart.ChartConfig;
```

### Using Colors

Reference colors using `var(--color-KEY)` format:

In components: `<Bar fill="var(--color-desktop)" />`

In chart data: `{ browser: "chrome", visitors: 275, color: "var(--color-chrome)" }`

In Tailwind: `<Label class="fill-(--color-desktop)" />`

## Tooltip

Chart tooltip contains label, name, indicator, and value. Customize using `hideLabel`, `hideIndicator` props and `indicator` prop (values: `dot`, `line`, `dashed`).

Use `labelKey` and `nameKey` to use custom keys for tooltip label and name.

### Chart.Tooltip Props

| Prop | Type | Description |
|------|------|-------------|
| `labelKey` | string | Config or data key for label |
| `nameKey` | string | Config or data key for name |
| `indicator` | `dot` \| `line` \| `dashed` | Indicator style |
| `hideLabel` | boolean | Hide label |
| `hideIndicator` | boolean | Hide indicator |
| `label` | string | Custom label |
| `labelFormatter` | function | Format label |
| `formatter` | Snippet | Flexible tooltip rendering |

Colors automatically reference chart config.

### Custom Tooltip Keys

```ts
const chartData = [
  { browser: "chrome", visitors: 187 },
  { browser: "safari", visitors: 200 },
];
const chartConfig = {
  visitors: { label: "Total Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
} satisfies ChartConfig;
```

```svelte
<Chart.Tooltip labelKey="visitors" nameKey="browser" />
```

Uses "Total Visitors" for label and "Chrome"/"Safari" for names.