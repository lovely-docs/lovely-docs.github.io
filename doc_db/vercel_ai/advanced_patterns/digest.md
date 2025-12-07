## Prompt Engineering

LLMs predict text sequences by assigning probabilities. Prompt engineering shapes responses through:
- **Instructions**: More specific prompts yield better results (e.g., "organic coffee shop" vs "coffee shop")
- **Examples**: Demonstrating expected output patterns improves model performance
- **Temperature**: Controls determinism (0 = identical outputs, >0 = varied outputs). Use ~0.6 for diverse suggestions

## Stream Cancellation

Cancel streams via `abortSignal` (server-side) or `stop()` hook (client-side):

```ts
// Server: forward request abort signal
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt,
  abortSignal: req.signal,
  onAbort: ({ steps }) => console.log('Aborted after', steps.length, 'steps'),
});

// Client: use stop() from useChat/useCompletion
const { completion, stop, status } = useCompletion();
return status === 'streaming' && <button onClick={() => stop()}>Stop</button>;
```

Use `onAbort` callback for cleanup (persist partial results, log events). For UI message streams, pass `consumeStream` function to `toUIMessageStreamResponse()` for proper abort handling. Note: incompatible with stream resumption.

## Back-pressure and Cancellation

Implement back-pressure using `ReadableStream.pull()` instead of eager `for await (...)` loops:

```ts
// Wrong: generator yields unbounded, buffer grows
new ReadableStream({
  async start(controller) {
    for await (const v of iterator) controller.enqueue(v);
  }
});

// Correct: values produced only when consumer requests
new ReadableStream({
  async pull(controller) {
    const { value, done } = await iterator.next();
    done ? controller.close() : controller.enqueue(value);
  }
});
```

Lazy approach prevents memory leaks when clients disconnect—generator stops yielding and resources are freed.

## Caching Responses

Two approaches:

**Language Model Middleware (recommended)**: Use `LanguageModelV3Middleware` with `wrapGenerate` and `wrapStream`:
```ts
const cacheMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params);
    const cached = await redis.get(cacheKey);
    if (cached) return cached;
    const result = await doGenerate();
    await redis.set(cacheKey, result);
    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    const cacheKey = JSON.stringify(params);
    const cached = await redis.get(cacheKey);
    if (cached) {
      return { stream: simulateReadableStream({ chunks: cached }) };
    }
    const { stream } = await doStream();
    const fullResponse = [];
    return { stream: stream.pipeThrough(new TransformStream({
      transform(chunk, controller) { fullResponse.push(chunk); controller.enqueue(chunk); },
      flush() { redis.set(cacheKey, fullResponse); }
    })) };
  }
};
```

**Lifecycle Callbacks**: Cache in `onFinish`:
```ts
streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages,
  async onFinish({ text }) {
    await redis.set(JSON.stringify(messages), text);
    await redis.expire(key, 3600);
  }
});
```

## Multiple Streamable UIs

Return multiple independent streamable components in single response:
```ts
export async function getWeather() {
  const weatherUI = createStreamableUI(<div>Loading...</div>);
  const forecastUI = createStreamableUI(<div>Loading...</div>);
  
  getWeatherData().then(data => weatherUI.done(<WeatherCard {...data} />));
  getForecastData().then(data => forecastUI.done(<ForecastCard {...data} />));
  
  return { weather: weatherUI.value, forecast: forecastUI.value };
}
```

Nest streamables as props for sequential updates:
```ts
async function getStockChart({ symbol }) {
  const ui = createStreamableUI(<Spinner />);
  (async () => {
    const price = await getStockPrice({ symbol });
    const historyChart = createStreamableUI(<Spinner />);
    ui.done(<StockCard historyChart={historyChart.value} price={price} />);
    const history = await fetch('...');
    historyChart.done(<HistoryChart data={history} />);
  })();
  return ui;
}
```

## Rate Limiting

Protect endpoints using Vercel KV + Upstash Ratelimit:
```ts
import { Ratelimit } from '@upstash/ratelimit';
import kv from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, '30s'),
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? 'ip';
  const { success } = await ratelimit.limit(ip);
  if (!success) return new Response('Ratelimited!', { status: 429 });
  // handle request
}
```

## Rendering UI with Language Models

Return JSON from tools instead of text, then render React components:
```ts
tools: {
  getWeather: {
    execute: async ({ city, unit }) => {
      const weather = getWeather({ city, unit });
      return { temperature, unit, description, forecast }; // JSON, not text
    }
  }
}
```

Use `createStreamableUI()` for server-side rendering to avoid client-side conditional logic:
```ts
const uiStream = createStreamableUI();
generateText({
  tools: {
    getWeather: {
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit });
        uiStream.done(<WeatherCard weather={weather} />);
      }
    }
  }
});
return { display: uiStream.value };
```

Client simply renders: `{messages.map(m => <div>{m.display}</div>)}`

## Language Models as Routers

Models can replace explicit routing by using function calling to decide which operations to perform:

```ts
generateText({
  tools: {
    getWeather: { /* ... */ },
    searchEvents: { /* ... */ }
  }
});
// Model calls getWeather for weather queries, searchEvents for event queries, or neither if out of scope
```

**Parameter-based routing**: Model generates correct parameters for dynamic routes (e.g., search function with artist name).

**Sequential routing**: Model chains function calls for multi-step tasks (e.g., check calendar → search venues → create event).

## Multistep Interfaces

Design multistep UIs by composing tools and managing application context:

**Tool Composition**: Break complex tasks into manageable steps. Example: flight booking with `searchFlights`, `lookupContacts`, `bookFlight` tools. Model chains calls: search → lookup contacts → book with contact info.

**Application Context**: State from previous steps affects model output in next steps. Example: user logs meal, then asks to delete "that meal"—model references previous context to identify which meal.

## Sequential Generations

Chain multiple AI calls where each output feeds into next prompt:
```ts
const ideas = await generateText({
  prompt: 'Generate 10 blog post ideas about spaghetti.'
});

const bestIdea = await generateText({
  prompt: `Ideas:\n${ideas}\n\nPick the best and explain why.`
});

const outline = await generateText({
  prompt: `Chosen idea:\n${bestIdea}\n\nCreate detailed outline.`
});
```

## Deployment to Vercel

1. Commit code (ensure `.env` in `.gitignore`)
2. Create GitHub repo and push
3. Import to Vercel via vercel.com/new
4. Add environment variables (Vercel parses `.env.local` format)
5. Deploy

**Configuration**: Set `export const maxDuration = 30;` in route handlers (default 10s on Hobby Tier, max 60s). Implement rate limiting and firewall for security.