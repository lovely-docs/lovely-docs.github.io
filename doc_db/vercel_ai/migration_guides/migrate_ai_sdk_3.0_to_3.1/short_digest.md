## Upgrading

Run `pnpm add ai@3.1`.

## AI SDK Core Migration

Replace provider SDK calls with unified AI SDK Core API:
```tsx
// Before
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({ model: 'gpt-4.1', stream: true, messages });
  return new StreamingTextResponse(OpenAIStream(response));
}

// After
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({ model: 'anthropic/claude-sonnet-4.5', messages });
  return result.toUIMessageStreamResponse();
}
```

## render to streamUI Migration

Replace `render` with `streamUI`, use AI SDK providers instead of provider SDKs, replace `provider` with `model`, use `system` parameter, and replace tool `render` key with `generate`:
```tsx
// Before
import { render } from '@ai-sdk/rsc';
import OpenAI from 'openai';
return render({ provider: openai, model: 'gpt-4.1', messages: [...], tools: { get_city_weather: { render: async function* ({ city }) { ... } } } });

// After
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
const result = await streamUI({ model: 'anthropic/claude-sonnet-4.5', system: 'You are a helpful assistant', messages: [...], tools: { get_city_weather: { generate: async function* ({ city }) { ... } } } });
return result.value;
```