

## Pages

### prompt_engineering
LLMs predict text sequences; prompt engineering shapes responses via clear instructions, examples, and temperature tuning (0=deterministic, 1=random); balance cost vs performance across models.

## What is a Large Language Model (LLM)?

LLMs are prediction engines that take word sequences as input and predict the most likely sequences to follow by assigning probabilities. They generate text iteratively until meeting a stopping criterion. Trained on massive text corpuses, they excel at tasks matching their training data (e.g., models trained on GitHub understand code well). Generated sequences can appear plausible but may not be grounded in reality.

## What is a prompt?

Prompts are the starting inputs that trigger LLMs to generate text. Prompt engineering encompasses crafting prompts and understanding related concepts: hidden prompts, tokens, token limits, and prompt hacking (jailbreaks, leaks).

## Why is prompt engineering needed?

Prompt engineering shapes LLM responses and enables them to handle broader query ranges using techniques like semantic search, command grammars, and ReActive architecture. Different models have varying performance, context windows, and costs—GPT-4 is more expensive and slower than GPT-3.5-turbo but more effective at certain tasks. Prompt engineering helps optimize the cost-performance tradeoff.

## Example: Slogan Generator

**Start with an instruction:** Clear instructions influence completions. "Create a slogan for a coffee shop" generates basic results, while "Create a slogan for an organic coffee shop" produces more targeted output by adding descriptive terms.

**Include examples:** Demonstrating expected output patterns improves results. Instead of "Create three slogans for a coffee shop with live music" (which may miss details), provide examples:
```
Business: Bookstore with cats
Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles"
Business: Gym with rock climbing
Slogans: "Peak Performance", "Reach New Heights", "Climb Your Way Fit"
Business: Coffee shop with live music
Slogans: [model generates better results]
```

**Tweak settings - Temperature:** Temperature (0-1) controls prediction confidence. At 0, identical prompts yield identical/nearly identical completions. At higher values (e.g., 1), the same prompt produces varied results. Lower temperature = more deterministic, precise completions; higher temperature = broader range of completions. For a slogan generator needing diverse suggestions, use moderate temperature around 0.6.

## Resources

- Vercel AI Playground for comparing model performance side-by-side and generating code
- Brex Prompt Engineering guide
- Prompt Engineering Guide by Dair AI

### stopping_streams
Cancel streams server-side with abortSignal/onAbort or client-side with stop() hook; handle cleanup via onAbort callback receiving completed steps; UI message streams use onFinish with isAborted parameter and consumeStream function.

## Cancelling Streams

Streams can be cancelled when users want to stop responses or from server-side logic.

### AI SDK Core

Use the `abortSignal` argument to cancel streams from server to LLM API, typically by forwarding the request's abort signal:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt,
  abortSignal: req.signal,
  onAbort: ({ steps }) => {
    console.log('Stream aborted after', steps.length, 'steps');
    // Persist partial results to database
  },
});
return result.toTextStreamResponse();
```

### AI SDK UI

Hooks like `useChat` and `useCompletion` provide a `stop()` helper function to cancel streams from client to server:

```tsx
const { input, completion, stop, status, handleSubmit, handleInputChange } = useCompletion();
return (
  <div>
    {(status === 'submitted' || status === 'streaming') && (
      <button type="button" onClick={() => stop()}>Stop</button>
    )}
    {completion}
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={handleInputChange} />
    </form>
  </div>
);
```

**Warning**: Stream abort is incompatible with stream resumption (`resume: true`). Choose one or the other.

### Handling Stream Abort Cleanup

The `onAbort` callback is called when a stream is aborted via `AbortSignal`, distinct from `onFinish` which handles normal completion:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a long story...',
  abortSignal: controller.signal,
  onAbort: ({ steps }) => {
    await savePartialResults(steps);
    await logAbortEvent(steps.length);
  },
  onFinish: ({ steps, totalUsage }) => {
    await saveFinalResults(steps, totalUsage);
  },
});
```

The `onAbort` callback receives `steps` (array of completed steps before abort). Use it for:
- Persisting partial conversation history
- Saving partial progress for later continuation
- Cleaning up server-side resources
- Logging abort events for analytics

You can also handle abort events directly in the stream:

```tsx
for await (const part of result.fullStream) {
  switch (part.type) {
    case 'abort':
      console.log('Stream was aborted');
      break;
  }
}
```

### UI Message Streams

For `toUIMessageStreamResponse`, the `onFinish` callback receives an `isAborted` parameter. Pass the `consumeStream` function for proper abort handling:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  abortSignal: req.signal,
});

return result.toUIMessageStreamResponse({
  onFinish: async ({ isAborted }) => {
    if (isAborted) {
      console.log('Stream was aborted');
    } else {
      console.log('Stream completed normally');
    }
  },
  consumeSseStream: consumeStream,
});
```

The `consumeStream` function ensures proper stream consumption even when aborted, preventing memory leaks or hanging connections.

### AI SDK RSC

Stream stopping is not currently supported in AI SDK RSC.

### backpressure
Use `ReadableStream.pull()` with manual iteration instead of eager `for await (...)` to implement back-pressure and cancellation, ensuring producers only generate data when consumers request it and stopping automatically when consumption ends.

## Back-pressure and Cancellation with Streams

Back-pressure is the signal from a consumer to a producer that more values aren't needed yet. Cancellation is the ability to stop producing values when the consumer stops consuming them.

### The Problem: Eager Approach

When wrapping a generator into a `ReadableStream` using an eager `for await (...)` loop in the `start` handler, the stream doesn't respect back-pressure:

```jsx
function createStream(iterator) {
  return new ReadableStream({
    async start(controller) {
      for await (const v of iterator) {
        controller.enqueue(v);
      }
      controller.close();
    },
  });
}
```

This spawns a perpetual loop that pushes data as fast as possible, regardless of whether the consumer needs it. The stream's internal buffer grows unbounded, and there's no way to signal the producer to stop. If a consumer stops reading (e.g., user navigates away), the producer continues indefinitely, consuming memory until the program crashes.

### The Solution: Lazy Approach

Use the `pull` handler instead, which is called only when the consumer attempts to read more data:

```jsx
function createStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
```

This approach:
- Manually calls `iterator.next()` to get the next value
- Only produces data when requested by the consumer
- Ties the producer's lifetime to the consumer's lifetime
- Keeps the internal buffer minimal (typically 1 item)
- Automatically stops producing when the consumer stops consuming

### Real-world Example: AI Streaming

When streaming infinite AI responses (e.g., "count from 1 to infinity"), the eager approach causes the server to continue requesting data from the AI service even after the user navigates away. The fetch connection doesn't abort, and memory grows unbounded.

With the lazy approach, when the user navigates away and the fetch connection aborts, the `ReadableStream` stops requesting new data from the AI service. The connection is freed and can be garbage collected. This is how the AI SDK handles streaming responses.

### caching
Cache AI responses via language model middleware (wrapGenerate/wrapStream with simulateReadableStream) or onFinish callbacks with KV storage.

## Caching Responses

Two approaches to cache AI provider responses:

### Language Model Middleware (Recommended)

Use `LanguageModelV3Middleware` with `wrapGenerate` and `wrapStream` methods to intercept model calls.

For `wrapGenerate` (used by `generateText` and `generateObject`):
- Create a cache key from params
- Check cache before calling `doGenerate()`
- Store result in cache after generation
- Restore timestamp fields from cached Date objects

For `wrapStream` (used by `streamText` and `streamObject`):
- Create a cache key from params
- If cached, use `simulateReadableStream()` to return cached `LanguageModelV3StreamPart[]` array chunk-by-chunk
- Control replay timing with `initialDelayInMs` and `chunkDelayInMs` parameters
- If not cached, pipe the stream through a `TransformStream` that collects all chunks and stores them in cache on flush

Example using Upstash Redis:
```ts
import { Redis } from '@upstash/redis';
import { LanguageModelV3Middleware, simulateReadableStream } from 'ai';

const redis = new Redis({ url: process.env.KV_URL, token: process.env.KV_TOKEN });

export const cacheMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params);
    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return { ...cached, response: { ...cached.response, timestamp: new Date(cached.response.timestamp) } };
    }
    const result = await doGenerate();
    redis.set(cacheKey, result);
    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    const cacheKey = JSON.stringify(params);
    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      const formattedChunks = (cached as LanguageModelV3StreamPart[]).map(p => 
        p.type === 'response-metadata' && p.timestamp ? { ...p, timestamp: new Date(p.timestamp) } : p
      );
      return { stream: simulateReadableStream({ initialDelayInMs: 0, chunkDelayInMs: 10, chunks: formattedChunks }) };
    }
    const { stream, ...rest } = await doStream();
    const fullResponse: LanguageModelV3StreamPart[] = [];
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        fullResponse.push(chunk);
        controller.enqueue(chunk);
      },
      flush() {
        redis.set(cacheKey, fullResponse);
      },
    });
    return { stream: stream.pipeThrough(transformStream), ...rest };
  },
};
```

### Lifecycle Callbacks

Use the `onFinish` callback in `streamText`, `generateText`, etc. to cache responses after generation completes.

Example with Upstash Redis in Next.js:
```tsx
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.KV_URL, token: process.env.KV_TOKEN });

export async function POST(req: Request) {
  const { messages } = await req.json();
  const key = JSON.stringify(messages);
  
  const cached = await redis.get(key);
  if (cached != null) {
    return new Response(formatDataStreamPart('text', cached), {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
    async onFinish({ text }) {
      await redis.set(key, text);
      await redis.expire(key, 60 * 60); // 1 hour TTL
    },
  });

  return result.toUIMessageStreamResponse();
}
```

Any KV storage provider can be used instead of Upstash Redis. The middleware approach is recommended as it's more transparent and works with all SDK functions.

### multiple_streamables
Return multiple streamable UIs from a single server action to stream independent components; nest streamables as props for composable UIs that update separately.

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

### rate_limiting
Implement API rate limiting with Vercel KV + Upstash Ratelimit: configure fixed window limiter, extract client IP, check limit before processing, return 429 on failure.

Rate limiting protects APIs from abuse by setting a maximum threshold on requests per timeframe, preventing excessive usage that degrades performance and increases costs.

**Implementation with Vercel KV and Upstash Ratelimit:**

Create a rate limiter instance using Upstash Ratelimit with Vercel KV as the Redis backend:

```tsx
import kv from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, '30s'),
});
```

In your API route, extract the client IP and check the rate limit before processing:

```tsx
export async function POST(req: NextRequest) {
  const ip = req.ip ?? 'ip';
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Ratelimited!', { status: 429 });
  }

  // Process request
}
```

The `fixedWindow(5, '30s')` configuration allows 5 requests per 30-second window. The `limit()` method returns `success` (boolean) and `remaining` (count) to determine if the request should be blocked. Return HTTP 429 status for rate-limited requests.

Ratelimit can be configured with different strategies and parameters - refer to Upstash Ratelimit documentation for advanced configuration options.

### rendering_ui_with_language_models
Render React components from language model tool calls by returning JSON objects; use @ai-sdk/rsc's createStreamableUI() to render components server-side and stream them to clients, avoiding complex client-side conditional rendering.

## Rendering User Interfaces with Language Models

Language models generate text, but you can render React components by having tools return JSON objects instead of text strings.

### Basic Approach: Client-Side Rendering

Instead of tools returning text:
```tsx
execute: async ({ city, unit }) => {
  const weather = getWeather({ city, unit });
  return `It is currently ${weather.value}°${unit}...`;
}
```

Return structured data:
```tsx
execute: async ({ city, unit }) => {
  const weather = getWeather({ city, unit });
  return {
    temperature,
    unit,
    description,
    forecast,
  };
}
```

Then conditionally render components on the client based on tool call results:
```tsx
{messages.map(message => {
  if (message.role === 'function') {
    const { temperature, unit, description, forecast } = message.content;
    return <WeatherCard weather={{ temperature, unit, description, forecast }} />
  }
})}
```

### Managing Multiple Tools

As applications grow with multiple tools (search courses, search people, meetings, buildings, events, meals), client-side conditional rendering becomes complex with nested ternaries.

### Server-Side Rendering with AI SDK RSC

The `@ai-sdk/rsc` module provides `createStreamableUI()` to render React components on the server and stream them to the client during model generation:

```tsx
import { createStreamableUI } from '@ai-sdk/rsc'

const uiStream = createStreamableUI();

const text = generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    getWeather: {
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit })
        uiStream.done(
          <WeatherCard weather={{ temperature: 47, unit: 'F', description: 'sunny', forecast }} />
        )
      }
    }
  }
})

return { display: uiStream.value }
```

On the client, simply render the streamed UI:
```tsx
{messages.map(message => (
  <div>{message.display}</div>
))}
```

This eliminates the need for client-side conditional rendering logic. The server handles component rendering and streaming, while the client only renders what arrives from the server. All operations from language model generation to UI rendering happen on the server using React Server Components.

### language_models_as_routers
Language models as routers: use function calling to deterministically choose UIs and execute multi-step sequences based on user intent instead of predefined routes.

## Generative User Interfaces

Language models can render user interfaces as part of their generations, creating generative user interfaces that are probabilistic rather than deterministic.

## Deterministic Routes with Probabilistic Reasoning

While generative UIs are non-deterministic by nature, language models can be constrained to deterministic outputs using function calling. When provided with function definitions, models either execute the most relevant function or execute none if the query is out of bounds.

Example: A weather assistant with a `getWeather` function will call it for weather queries but not for unrelated queries like "What events are happening in London?"

```tsx
const sendMessage = (prompt: string) =>
  generateText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'you are a friendly weather assistant!',
    prompt,
    tools: {
      getWeather: {
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      },
    },
  });
```

This model ability to reason about which function to execute is considered emergent reasoning behavior.

## Language Models as Routers

Traditionally, developers write routing logic to connect application parts. Language models can replace this by deciding which UI to render based on user state, enabling conversational interaction instead of navigating predefined routes.

### Routing by Parameters

Models can generate correct parameters for dynamic routes like `/profile/[username]`, `/search?q=[query]`, `/media/[id]`. In a search application, users ask the model to search for artworks by different artists, and the model calls the search function with the artist name and renders results.

### Routing by Sequence

Models can generate sequences of function calls to complete multi-step tasks. In a calendar application, asking to "schedule a happy hour with friends" triggers the model to:
1. Lookup your calendar
2. Lookup friends' calendars
3. Determine best time
4. Search for nearby happy hour spots
5. Create event and send invites

By defining functions for lookups, calendar pulls, and location searches, the model sequentially navigates routes automatically.

Use `streamUI` function to stream generative user interfaces to the client based on model responses.

### multistep_interfaces
Design multistep interfaces by composing tools to populate application context, reducing user steps and enabling models to complete complex tasks without additional prompts.

## Multistep Interfaces

Multistep interfaces are UIs requiring multiple independent steps to complete a task. Two core concepts underpin their design:

**Tool Composition**: Combining multiple tools to create new tools, breaking complex tasks into manageable steps. The composition strategy directly affects both user experience and the model's ability to generate correct outputs.

**Application Context**: The conversation history and state between user and language model. In multistep interfaces, user input in one step affects model output in subsequent steps, making rich context essential for coherent responses.

### Application Context Example

In a meal logging app with `log_meal` and `delete_meal` tools, the model must reference previous actions:

```
User: Log a chicken shawarma for lunch.
Tool: log_meal("chicken shawarma", "250g", "12:00 PM")
Model: Chicken shawarma has been logged for lunch.
...
User: I skipped lunch today, can you update my log?
Tool: delete_meal("chicken shawarma")
Model: Chicken shawarma has been deleted from your log.
```

The model uses context from the first step to correctly identify which meal to delete.

### Tool Composition Example

A flight booking assistant with `searchFlights`, `lookupFlight`, and `bookFlight` tools demonstrates composition:

```
User: I want to book a flight from New York to London.
Tool: searchFlights("New York", "London")
Model: Here are the available flights from New York to London.
User: I want to book flight number BA123 on 12th December for myself and my wife.
Tool: lookupFlight("BA123") -> "4 seats available"
Model: Sure, there are seats available! Can you provide the names of the passengers?
User: John Doe and Jane Doe.
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
Model: Your flight has been booked!
```

This can be optimized by composing with a `lookupContacts` tool to auto-populate passenger details:

```
User: I want to book a flight from New York to London.
Tool: searchFlights("New York", "London")
Model: Here are the available flights from New York to London.
User: I want to book flight number BA123 on 12th December for myself and my wife.
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
Model: Your flight has been booked!
```

Further composition with `lookupBooking` enables complex queries:

```
User: What's the status of my wife's upcoming flight?
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: lookupBooking("Jane Doe") -> "BA123 confirmed"
Tool: lookupFlight("BA123") -> "Flight BA123 is scheduled to depart on 12th December."
Model: Your wife's flight BA123 is confirmed and scheduled to depart on 12th December.
```

The more tools designed to compose together, the more complex and powerful the application becomes. Tool composition reduces user steps by allowing the model to call tools that populate context before using that information to complete tasks.

### sequential_generations
Sequential generations chain multiple generateText() calls with outputs feeding into subsequent prompts for multi-step workflows.

Sequential generations (chains/pipes) allow you to create workflows where the output of one generation becomes the input for the next, enabling dependent multi-step AI operations.

**Use Case**: Breaking down complex tasks into smaller, manageable steps where each step builds on the previous result.

**Implementation**: Use `generateText()` multiple times, passing the output from one call as input to the next. Example workflow:
1. Generate blog post ideas with `generateText()` using a prompt
2. Pass the generated ideas to another `generateText()` call to pick the best idea
3. Pass the selected idea to a third `generateText()` call to create an outline

Each generation is awaited sequentially, allowing you to access the full text output (via the `.text` property or direct string interpolation) and use it in subsequent prompts. This pattern works with any model available through the SDK.

### vercel_deployment_guide
Deploy Next.js AI apps to Vercel with git workflow; configure maxDuration for LLM timeouts; add rate limiting and firewall security.

## Deploying AI Applications to Vercel

Deploy Next.js AI applications to Vercel using git-centered workflow with automatic deployments on main branch pushes.

### Prerequisites
- Vercel account
- Git provider account (GitHub, GitLab, or Bitbucket)
- OpenAI API key

### Setup Steps

**1. Prepare Local Repository**
Ensure `.gitignore` excludes `.env` and `node_modules`:
```bash
git add .
git commit -m "init"
```

**2. Create Git Repository**
Create repository on GitHub, then push existing repository:
```bash
git remote add origin <repository-url>
git branch -M main
git push -u origin main
```
If "remote origin already exists" error occurs:
```bash
rm -rf .git
git init
git add .
git commit -m "init"
```

**3. Import to Vercel**
- Go to vercel.com/new
- Select Git provider and authenticate
- Click Import on your repository
- Expand "Environment Variables" section and paste `.env.local` contents (Vercel auto-parses key:value format)
- Click Deploy button

### Infrastructure Considerations

**Function Duration**
Vercel serverless functions default to 10 second maximum on Hobby Tier. LLM responses may exceed this. Set custom duration in route handler or server action:
```ts
export const maxDuration = 30;
```
Maximum 60 seconds on Hobby Tier; check documentation for other tier limits.

### Security Measures

**Rate Limiting**
Implement rate limiting to regulate requests per client within time frame. Reference Vercel's rate limiting guide.

**Firewall**
Use Vercel Firewall for DDoS protection and unauthorized access prevention. Enterprise teams get custom IP blocking rules and dedicated support.

### Troubleshooting
- Streaming not working when proxied
- Timeouts on Vercel

