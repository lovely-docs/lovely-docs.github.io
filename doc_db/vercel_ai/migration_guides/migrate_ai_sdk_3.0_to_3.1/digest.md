## Upgrading to AI SDK 3.1

Run `pnpm add ai@3.1` to update.

## Key Changes

AI SDK 3.1 introduces two major features:
1. **AI SDK Core**: A unified API for interacting with LLMs across any provider implementing the AI SDK Language Model Specification
2. **streamUI**: A new abstraction built on AI SDK Core for building streaming UIs

## Migrating from Legacy Providers to AI SDK Core

**Before (using provider SDK directly):**
```tsx
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    stream: true,
    messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

**After (using AI SDK Core):**
```tsx
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
  });
  return result.toUIMessageStreamResponse();
}
```

The new approach provides a unified API that works with any compatible provider.

## Migrating from `render` to `streamUI`

**Before (using render with OpenAI SDK):**
```tsx
import { render } from '@ai-sdk/rsc';
import OpenAI from 'openai';
import { z } from 'zod';
import { Spinner, Weather } from '@/components';
import { getWeather } from '@/utils';

const openai = new OpenAI();

async function submitMessage(userInput = 'What is the weather in SF?') {
  'use server';
  return render({
    provider: openai,
    model: 'gpt-4.1',
    messages: [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: userInput },
    ],
    text: ({ content }) => <p>{content}</p>,
    tools: {
      get_city_weather: {
        description: 'Get the current weather for a city',
        parameters: z.object({ city: z.string().describe('the city') }).required(),
        render: async function* ({ city }) {
          yield <Spinner />;
          const weather = await getWeather(city);
          return <Weather info={weather} />;
        },
      },
    },
  });
}
```

**After (using streamUI with AI SDK provider):**
```tsx
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { Spinner, Weather } from '@/components';
import { getWeather } from '@/utils';

async function submitMessage(userInput = 'What is the weather in SF?') {
  'use server';
  const result = await streamUI({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'You are a helpful assistant',
    messages: [{ role: 'user', content: userInput }],
    text: ({ content }) => <p>{content}</p>,
    tools: {
      get_city_weather: {
        description: 'Get the current weather for a city',
        parameters: z.object({ city: z.string().describe('Name of the city') }).required(),
        generate: async function* ({ city }) {
          yield <Spinner />;
          const weather = await getWeather(city);
          return <Weather info={weather} />;
        },
      },
    },
  });
  return result.value;
}
```

Key differences: `streamUI` uses AI SDK providers instead of provider SDKs, replaces `provider` parameter with `model`, uses `system` instead of system message in messages array, and replaces `render` key with `generate` in tool definitions.