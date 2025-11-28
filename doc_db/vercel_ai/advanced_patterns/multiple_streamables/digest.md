## Multiple Streamable UIs

The RSC APIs allow composing and returning multiple streamable UIs along with other data in a single request. This decouples UI into smaller components that stream independently.

Example: Create multiple streamable UIs, update them with loading states, then resolve them with actual data:
```tsx
export async function getWeather() {
  const weatherUI = createStreamableUI();
  const forecastUI = createStreamableUI();

  weatherUI.update(<div>Loading weather...</div>);
  forecastUI.update(<div>Loading forecast...</div>);

  getWeatherData().then(weatherData => {
    weatherUI.done(<div>{weatherData}</div>);
  });

  getForecastData().then(forecastData => {
    forecastUI.done(<div>{forecastData}</div>);
  });

  return {
    requestedAt: Date.now(),
    weather: weatherUI.value,
    forecast: forecastUI.value,
  };
}
```

The client receives a data structure with multiple streamable UI fields that update independently based on when their data resolves.

## Nested Streamable UIs

Stream UI components within other UI components to build complex UIs from reusable parts. Pass a streamable as a prop to a parent component, which renders it and automatically updates as the server responds.

Example: Pass a `historyChart` streamable to a `StockCard` component:
```tsx
async function getStockHistoryChart({ symbol: string }) {
  'use server';

  const ui = createStreamableUI(<Spinner />);

  (async () => {
    const price = await getStockPrice({ symbol });
    const historyChart = createStreamableUI(<Spinner />);
    ui.done(<StockCard historyChart={historyChart.value} price={price} />);

    const historyData = await fetch('https://my-stock-data-api.com');
    historyChart.done(<HistoryChart data={historyData} />);
  })();

  return ui;
}
```

The parent component renders immediately with a spinner, then the nested streamable updates independently once data arrives.