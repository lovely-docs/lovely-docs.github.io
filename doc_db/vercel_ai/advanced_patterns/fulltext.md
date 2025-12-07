

## Pages

### prompt_engineering
LLMs predict text sequences; prompt engineering shapes responses via specific instructions, examples, and temperature settings (0=deterministic, 1=creative).

## What is a Large Language Model (LLM)?

LLMs are prediction engines that take word sequences as input and predict the most likely sequences to follow by assigning probabilities. They generate text until meeting a stopping criterion. Trained on massive text corpuses, they excel at some use cases better than others (e.g., models trained on GitHub understand code well). Generated sequences can seem plausible but may not be grounded in reality.

## What is a prompt?

Prompts are starting points for LLMs—inputs that trigger text generation. Prompt engineering encompasses crafting prompts and understanding related concepts: hidden prompts, tokens, token limits, and prompt hacking (jailbreaks, leaks).

## Why is prompt engineering needed?

Prompt engineering shapes LLM responses and enables tweaking models for broader query ranges using techniques like semantic search, command grammars, and ReActive architecture. Different models have varying performance, context windows, and costs (e.g., GPT-4 is more expensive and slower than GPT-3.5-turbo but more effective at certain tasks). Trade-offs exist between cost and performance.

## Example: Slogan Generator

**Start with an instruction:**
- Basic: `Create a slogan for a coffee shop.`
- More specific: `Create a slogan for an organic coffee shop.`

Adding descriptive terms influences completions—prompts "instruct" or "program" the model.

**Include examples:**
- Simple request: `Create three slogans for a coffee shop with live music.` (model may miss details)
- With examples:
```
Create three slogans for a business with unique features.

Business: Bookstore with cats
Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles"
Business: Gym with rock climbing
Slogans: "Peak Performance", "Reach New Heights", "Climb Your Way Fit"
Business: Coffee shop with live music
Slogans:
```

Demonstrating expected output patterns helps the model generate better results.

**Tweak settings:**

Temperature (0 to 1) governs model confidence in predictions:
- Temperature 0: Same prompt yields identical/nearly identical completions (deterministic)
- Temperature > 0: Same prompt yields varied completions (creative)
- Lower temperature: More precise, deterministic completions
- Higher temperature: Broader range of completions

For a slogan generator needing diverse suggestions, use moderate temperature around 0.6.

### stopping-streams
Cancel streams via abortSignal (server-side) or stop() hook (client-side); use onAbort callback for cleanup; UI message streams require consumeStream function.

## Cancelling Streams

Streams can be cancelled in different parts of the AI SDK:

### AI SDK Core
Use the `abortSignal` argument to cancel streams from server to LLM API, typically by forwarding the request's abort signal:

```tsx
import { streamText } from 'ai';

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
const { completion, stop, status, handleSubmit, handleInputChange } = useCompletion();

return (
  <div>
    {(status === 'submitted' || status === 'streaming') && (
      <button onClick={() => stop()}>Stop</button>
    )}
    {completion}
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={handleInputChange} />
    </form>
  </div>
);
```

**Note:** Stream abort is incompatible with stream resumption (`resume: true`). Choose one or the other.

### Handling Stream Abort Cleanup
The `onAbort` callback is called when a stream is aborted via `AbortSignal`, distinct from `onFinish` which handles normal completion:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a long story...',
  abortSignal: controller.signal,
  onAbort: ({ steps }) => {
    // Called on abort - persist partial results
    await savePartialResults(steps);
    await logAbortEvent(steps.length);
  },
  onFinish: ({ steps, totalUsage }) => {
    // Called on normal completion
    await saveFinalResults(steps, totalUsage);
  },
});
```

The `onAbort` callback receives `steps` (array of completed steps before abort). Use cases: persisting partial conversation history, saving progress for continuation, cleaning up resources, logging abort events.

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
import { consumeStream, convertToModelMessages, streamText } from 'ai';

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
Use `ReadableStream.pull()` with manual iteration instead of eager `for await (...)` to implement back-pressure and cancellation, preventing unbounded buffering and memory leaks when streaming AI responses.

## Back-pressure and Cancellation with Streams

Back-pressure is the signal from a consumer to a producer that more values aren't needed yet. When wrapping a generator into a `ReadableStream` using an eager `for await (...)` loop in the `start` handler, the stream doesn't respect back-pressure. The generator continuously pushes values as fast as possible, causing the stream's internal buffer to grow unbounded.

**Eager approach (problematic):**
```jsx
async function* integers() {
  let i = 1;
  while (true) {
    console.log(`yielding ${i}`);
    yield i++;
    await sleep(100);
  }
}

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

async function run() {
  const stream = createStream(integers());
  const reader = stream.getReader();
  for (let i = 0; i < 10_000; i++) {
    const { value } = await reader.read();
    console.log(`read ${value}`);
    await sleep(1_000);
  }
}
```

With this approach, the generator yields ~10 values for every 1 value read, because the generator (100ms per yield) runs 10x faster than the reader (1000ms per read). The stream buffer grows unbounded.

**Lazy approach (correct):**
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

Using the `pull` handler instead of `start`, values are produced only when the consumer requests them. The `pull` handler is called each time the consumer reads from the stream. This ties the producer's lifetime to the consumer's lifetime.

## Cancellation

When a consumer stops reading from a stream (e.g., user navigates away), the eager approach continues yielding values indefinitely, buffering them in memory until the program runs out of memory. The eager `for await (...)` loop has no signal to stop.

With the lazy approach, when the consumer stops reading, `pull` is no longer called, so the generator stops yielding. This naturally frees resources and allows garbage collection.

## Application to AI Responses

When streaming AI responses (e.g., from an API endpoint), if the client disconnects (user navigates away, page reloads), an eager approach would continue fetching data from the AI service and buffering it server-side until memory is exhausted. A lazy approach ensures that when the fetch connection aborts, the stream stops requesting data, the `ReadableStream` can be garbage collected, and the connection to the AI service is freed.

### caching
Cache AI responses using language model middleware (intercept with wrapGenerate/wrapStream) or onFinish callbacks; replay cached streams with simulateReadableStream.

## Caching Responses

Two approaches to cache AI provider responses:

### Language Model Middleware (Recommended)

Use `LanguageModelV3Middleware` with `wrapGenerate` and `wrapStream` methods to intercept model calls.

For `wrapGenerate` (used by `generateText`, `generateObject`):
- Create cache key from params: `const cacheKey = JSON.stringify(params)`
- Check cache before calling `doGenerate()`
- Store result in cache after generation

For `wrapStream` (used by `streamText`, `streamObject`):
- Check cache before calling `doStream()`
- If cached, use `simulateReadableStream()` to return cached chunks with configurable delays (`initialDelayInMs`, `chunkDelayInMs`)
- If not cached, pipe stream through `TransformStream` to collect chunks and store in cache on flush

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
      return { ...cached, response: { ...cached.response, timestamp: cached?.response?.timestamp ? new Date(cached?.response?.timestamp) : undefined } };
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
      transform(chunk, controller) { fullResponse.push(chunk); controller.enqueue(chunk); },
      flush() { redis.set(cacheKey, fullResponse); }
    });
    return { stream: stream.pipeThrough(transformStream), ...rest };
  },
};
```

### Lifecycle Callbacks

Use `onFinish` callback in `streamText` to cache response after generation completes.

Example with Upstash Redis and 1-hour expiration:
```ts
import { openai } from '@ai-sdk/openai';
import { formatDataStreamPart, streamText } from 'ai';
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.KV_URL, token: process.env.KV_TOKEN });

export async function POST(req: Request) {
  const { messages } = await req.json();
  const key = JSON.stringify(messages);
  
  const cached = await redis.get(key);
  if (cached != null) {
    return new Response(formatDataStreamPart('text', cached), { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
    async onFinish({ text }) {
      await redis.set(key, text);
      await redis.expire(key, 60 * 60);
    },
  });

  return result.toUIMessageStreamResponse();
}
```

Works with any KV storage provider, not just Upstash Redis.

### multiple_streamables
Compose multiple streamable UI components in single response or nest them as props; each updates independently as async data resolves.

## Multiple Streamable UIs

Return multiple streamable UI components in a single server action response. Each streamable can update independently based on async operations.

```tsx
'use server';
import { createStreamableUI } from '@ai-sdk/rsc';

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

The returned object contains both streamable UIs and other data fields. Components update independently based on when their data resolves.

## Nested Streamable UIs

Stream UI components within other UI components by passing streamables as props. Child components automatically update as the server sends new data.

```tsx
'use server';
async function getStockHistoryChart({ symbol }: { symbol: string }) {
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

Wrap async operations in an IIFE to avoid blocking. Parent components render child streamables which update independently.

### rate-limiting
Rate limit API endpoints with Vercel KV + Upstash Ratelimit using fixed window limiter; check IP-based limits and return 429 on exceeded threshold.

## Rate Limiting

Rate limiting protects APIs from abuse by setting a maximum threshold on requests per timeframe, preventing excessive usage that degrades performance and increases costs.

### Implementation with Vercel KV and Upstash Ratelimit

Protect API endpoints using Vercel KV (Redis) and Upstash Ratelimit library:

```tsx
import kv from '@vercel/kv';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, '30s'),
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? 'ip';
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Ratelimited!', { status: 429 });
  }

  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
  });

  return result.toUIMessageStreamResponse();
}
```

The pattern: create a Ratelimit instance with Redis backend and fixed window limiter (5 requests per 30 seconds), extract client IP from request, call `ratelimit.limit(ip)` to check if request is allowed, return 429 status if rate limit exceeded, otherwise proceed with normal request handling.

### rendering-ui-with-language-models
Return JSON from tools to render React components; use @ai-sdk/rsc's createStreamableUI() to render components server-side and stream them to client instead of managing multiple conditional renders client-side.

## Rendering User Interfaces with Language Models

Language models generate text, but you can render React components by having tools return JSON objects instead of text strings.

### Basic Pattern

Instead of returning text from a tool:
```tsx
execute: async ({ city, unit }) => {
  const weather = getWeather({ city, unit });
  return `It is currently ${weather.value}°${unit}...`;
}
```

Return a JSON object:
```tsx
execute: async ({ city, unit }) => {
  const weather = getWeather({ city, unit });
  return { temperature, unit, description, forecast };
}
```

Then render components on the client based on the tool response:
```tsx
{messages.map(message => {
  if (message.role === 'function') {
    const { temperature, unit, description, forecast } = message.content;
    return <WeatherCard weather={{ temperature, unit, description, forecast }} />;
  }
})}
```

### Managing Multiple Tools

As applications grow with multiple tools (search courses, search people, meetings, buildings, events, meals), client-side conditional rendering becomes complex with nested ternaries.

### Server-Side Rendering with RSC

The `@ai-sdk/rsc` module provides `createStreamableUI()` to render React components on the server and stream them to the client, eliminating client-side conditional logic.

```tsx
import { createStreamableUI } from '@ai-sdk/rsc';

const uiStream = createStreamableUI();

const text = generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'you are a friendly assistant',
  prompt: 'what is the weather in SF?',
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({
        city: z.string().describe('The city to get the weather for'),
        unit: z.enum(['C', 'F']).describe('The unit to display the temperature in')
      }),
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit });
        uiStream.done(
          <WeatherCard weather={{ temperature: 47, unit: 'F', description: 'sunny', forecast }} />
        );
      }
    }
  }
});

return { display: uiStream.value };
```

On the client, simply render the streamed UI:
```tsx
{messages.map(message => (
  <div>{message.display}</div>
))}
```

This simplifies the flow: user prompt → model generates tool call → tool renders component → stream to client → client renders directly.

### language-models-as-routers
Language models can replace explicit routing logic by using function calling to reason about which operations to perform and which UIs to render based on user intent, supporting both parameter-based and sequential multi-step routing.

## Generative User Interfaces

Language models can render user interfaces as part of their generations, creating non-deterministic but predictable experiences through function calling.

### Deterministic Routes via Function Calling

Language models can be constrained to deterministic outputs by providing function definitions. The model either executes the most relevant function or executes none if the query is out of bounds.

Example: Weather assistant with function calling
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

sendMessage('What is the weather in San Francisco?'); // getWeather is called
sendMessage('What is the weather in New York?'); // getWeather is called
sendMessage('What events are happening in London?'); // No function is called
```

This ability to reason about which function to execute is an emergent capability that enables models to act as routers.

### Language Models as Routers

Instead of developers managing explicit routing logic (like `/login`, `/user/john`, `/api/events?limit=5`), language models can decide which UI to render based on user state and intent, enabling conversational navigation.

**Routing by parameters**: Models generate correct parameters for dynamic routes. Example: In a search app, ask the model to search for artworks by different artists—it calls the search function with the artist name and renders results.

**Routing by sequence**: Models execute sequences of function calls to complete multi-step tasks. Example: In a calendar app, ask to schedule a happy hour with friends. The model:
1. Looks up your calendar
2. Looks up friends' calendars
3. Determines best time
4. Searches for nearby happy hour spots
5. Creates event and sends invites

By defining functions for lookups, calendar pulls, and location searches, the model sequentially navigates routes automatically. Use `streamUI` to stream generative UIs to the client based on model responses.

### multistep_interfaces
Design multistep UIs by composing tools and managing application context so model output in one step uses information from previous steps.

## Multistep Interfaces

Multistep interfaces are UIs requiring multiple independent steps to complete a task. Two core concepts:

**Tool Composition**: Combining multiple tools to create new tools, breaking complex tasks into manageable steps.

**Application Context**: The state of the application including user input, model output, and relevant information. In multistep interfaces, user input in one step affects model output in the next step.

### Application Context Example

Meal logging app with `log_meal` and `delete_meal` tools:

```
User: Log a chicken shawarma for lunch.
Tool: log_meal("chicken shawarma", "250g", "12:00 PM")
Model: Chicken shawarma has been logged for lunch.

User: I skipped lunch today, can you update my log?
Tool: delete_meal("chicken shawarma")
Model: Chicken shawarma has been deleted from your log.
```

The model references previous context to identify which meal to delete.

### Tool Composition Example

Flight booking assistant with `searchFlights`, `lookupFlight`, `bookFlight`, `lookupContacts`, and `lookupBooking` tools:

```
User: I want to book a flight from New York to London.
Tool: searchFlights("New York", "London")
Model: Here are the available flights from New York to London.

User: I want to book flight number BA123 on 12th December for myself and my wife.
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
Model: Your flight has been booked!
```

The `lookupContacts` tool populates context before `bookFlight`, reducing user steps.

```
User: What's the status of my wife's upcoming flight?
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: lookupBooking("Jane Doe") -> "BA123 confirmed"
Tool: lookupFlight("BA123") -> "Flight BA123 is scheduled to depart on 12th December."
Model: Your wife's flight BA123 is confirmed and scheduled to depart on 12th December.
```

Composing tools together enables complex, powerful applications by allowing the model to chain tool calls and use their outputs as context for subsequent calls.

### sequential-generations
Sequential generations chain multiple AI calls where each output feeds into the next prompt for dependent multi-step workflows.

## Sequential Generations (Chains)

Create sequences of dependent generations where each step's output becomes the next step's input.

### Example: Blog Post Workflow

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

async function sequentialActions() {
  // Step 1: Generate ideas
  const ideasGeneration = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Generate 10 ideas for a blog post about making spaghetti.',
  });

  // Step 2: Pick best idea (uses output from step 1)
  const bestIdeaGeneration = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: `Here are some blog post ideas about making spaghetti:
${ideasGeneration}

Pick the best idea from the list above and explain why it's the best.`,
  });

  // Step 3: Generate outline (uses output from step 2)
  const outlineGeneration = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: `We've chosen the following blog post idea about making spaghetti:
${bestIdeaGeneration}

Create a detailed outline for a blog post based on this idea.`,
  });
}

sequentialActions().catch(console.error);
```

Each `generateText()` call uses the previous generation's output embedded in the prompt string. This pattern enables breaking down complex tasks into smaller, dependent steps where later steps build on earlier results.

### vercel_deployment_guide
Deploy Next.js AI app to Vercel with git integration, configure maxDuration for LLM timeouts, add rate limiting and firewall security.

## Deployment Steps

1. **Commit Changes**: Ensure `.gitignore` excludes `.env` and `node_modules`, then commit with `git add .` and `git commit -m "init"`

2. **Create Git Repository**: Create a new repository on GitHub, then push your local code using the commands GitHub provides. If you get "remote origin already exists" error, run:
```bash
rm -rf .git
git init
git add .
git commit -m "init"
```

3. **Import to Vercel**: Go to vercel.com/new, select your Git provider, sign in, and click Import next to your repository

4. **Add Environment Variables**: Expand "Environment Variables" section and paste your `.env.local` file contents. Vercel automatically parses variables into key:value format

5. **Deploy**: Click Deploy button. View your deployment by selecting the Project and clicking Domain

## Infrastructure Considerations

**Function Duration**: Vercel serverless functions default to 10 second max on Hobby Tier. LLM calls may exceed this. Increase with route segment config:
```ts
export const maxDuration = 30;
```
Max 60 seconds on Hobby Tier; check documentation for other tiers.

## Security

**Rate Limiting**: Implement to prevent abuse from high LLM costs. Follow Vercel's rate limiting guide.

**Firewall**: Use Vercel Firewall for DDoS protection and unauthorized access prevention. Enterprise teams get custom IP blocking rules.

## Troubleshooting

- Streaming not working when proxied
- Timeouts on Vercel

