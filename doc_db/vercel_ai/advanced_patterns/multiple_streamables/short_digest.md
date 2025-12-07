Return multiple independent streamable UIs in a single response, or nest streamables as props to child components. Each updates asynchronously based on data resolution.

```tsx
// Multiple streamables
return { weather: weatherUI.value, forecast: forecastUI.value };

// Nested streamables
ui.done(<StockCard historyChart={historyChart.value} />);
```