## Chart

Beautiful, customizable charts built on LayerChart. Copy and paste into your apps.

**Installation:**
```bash
npx shadcn-svelte@latest add chart -y -o
```

### Basic Usage

Define data, config, and build chart using LayerChart components:

```ts
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
];

const chartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
  mobile: { label: "Mobile", color: "#60a5fa" },
} satisfies Chart.ChartConfig;
```

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
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

### Customization

Format axis ticks with `props`:
```svelte
<BarChart {data} props={{ xAxis: { format: (d) => d.slice(0, 3) } }} />
```

Add legend: `<BarChart {data} legend />`

### Theming

Define CSS variables (recommended):
```css
:root { --chart-1: oklch(0.646 0.222 41.116); }
```

Use in config: `color: "var(--chart-1)"` or direct values like `"#2563eb"`

Reference in components: `fill="var(--color-desktop)"`

### Tooltip Props

| Prop | Type | Description |
|------|------|-------------|
| `labelKey` | string | Config/data key for label |
| `nameKey` | string | Config/data key for name |
| `indicator` | `dot` \| `line` \| `dashed` | Indicator style |
| `hideLabel` | boolean | Hide label |
| `hideIndicator` | boolean | Hide indicator |
| `label` | string | Custom label |
| `labelFormatter` | function | Format label |
| `formatter` | Snippet | Custom rendering |

Custom keys example:
```svelte
<Chart.Tooltip labelKey="visitors" nameKey="browser" />
```