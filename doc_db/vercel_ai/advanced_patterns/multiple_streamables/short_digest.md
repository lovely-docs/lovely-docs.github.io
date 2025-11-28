## Multiple Streamable UIs

Return multiple streamable UIs in a single request to stream components independently:
```tsx
return {
  weather: weatherUI.value,
  forecast: forecastUI.value,
};
```

## Nested Streamable UIs

Pass streamables as props to parent components for complex, composable UIs that update independently:
```tsx
ui.done(<StockCard historyChart={historyChart.value} price={price} />);
```