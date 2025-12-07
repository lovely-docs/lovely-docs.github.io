
## Directories

### foundations
Foundational concepts, provider ecosystem, prompt types, tools, and streaming for building AI applications.

## Generative AI Concepts

**Generative Models**: Predict and generate outputs (text, images, audio) based on statistical patterns from training data.

**Large Language Models (LLM)**: Subset of generative models that take a sequence of words and predict the most likely next sequence by assigning probabilities. Continue generating until a stopping criterion is met. Trained on massive text collections, so performance varies by domain. Key limitation: hallucination—when asked about unknown information, LLMs may fabricate answers.

**Embedding Models**: Convert complex data (words, images) into dense vector representations (lists of numbers). Unlike generative models, they don't generate new content but provide semantic and syntactic relationship representations usable as input for other models or NLP tasks.

## Providers and Models

The AI SDK provides a unified interface for 50+ LLM providers including OpenAI, Anthropic, Google, Mistral, xAI, Groq, and many others. This abstraction layer allows switching between providers without changing application code.

**Official providers**: xAI Grok, OpenAI, Azure OpenAI, Anthropic, Amazon Bedrock, Google Generative AI, Google Vertex, Mistral, Together.ai, Cohere, Fireworks, DeepInfra, DeepSeek, Cerebras, Groq, Perplexity, ElevenLabs, LMNT, Hume, Rev.ai, Deepgram, Gladia, AssemblyAI, Baseten.

**OpenAI-compatible providers**: LM Studio, Heroku.

**Community providers**: Ollama, FriendliAI, Portkey, Cloudflare Workers AI, OpenRouter, and 20+ others.

**Self-hosted models** accessible via Ollama, LM Studio, Baseten, or any OpenAI-compatible provider.

Model capabilities matrix shows support for: image input, object generation, tool usage, and tool streaming across popular models from each provider.

## Prompts

Three prompt types:

**Text Prompts**: Simple string prompts, ideal for repeated generation with variants:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**System Prompts**: Initial instructions guiding model behavior, works with both `prompt` and `messages`:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You help planning travel itineraries.',
  prompt: 'I am planning a trip to ${destination}...',
});
```

**Message Prompts**: Array of user, assistant, and tool messages for chat interfaces and complex multi-modal prompts:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
    { role: 'user', content: 'Where can I buy the best Currywurst in Berlin?' },
  ],
});
```

**Message Content Types**:
- **Text parts**: Most common content type
- **Image parts**: Can be base64-encoded, binary (ArrayBuffer/Uint8Array/Buffer), or URL
- **File parts**: Supported by Google Generative AI, Google Vertex AI, OpenAI (wav/mp3 audio, pdf), Anthropic. Requires MIME type.
- **Custom download function** (experimental): Implement throttling, retries, authentication, caching for file downloads

**Assistant Messages**: Messages with role `assistant`, typically previous responses. Can contain text, reasoning, and tool call parts.

**Tool Messages**: For models supporting tool calls. Assistant messages contain tool call parts, tool messages contain tool output parts. Single assistant message can call multiple tools, single tool message can contain multiple results.

**System Messages**: Messages sent before user messages to guide assistant behavior. Alternative to `system` property.

**Provider Options**: Pass provider-specific metadata at three levels:
- Function level: for general provider options
- Message level: for granular control
- Message part level: for specific content parts

## Tools

A tool is an object that an LLM can invoke to perform discrete tasks. Tools are passed to `generateText` and `streamText` via the `tools` parameter.

A tool consists of three properties:
- **`description`**: Optional description influencing when the tool is picked
- **`inputSchema`**: Zod or JSON schema defining required input, consumed by the LLM and used to validate tool calls
- **`execute`**: Optional async function called with arguments from the tool call

When an LLM decides to use a tool, it generates a tool call. Tools with an `execute` function run automatically, and their output is returned as tool result objects. Tool results can be automatically passed back to the LLM using multi-step calls with `streamText` and `generateText`.

**Schemas**: Define tool parameters and validate tool calls. The AI SDK supports raw JSON schemas (using `jsonSchema` function) and Zod schemas (directly or using `zodSchema` function).

Example Zod schema:
```ts
import z from 'zod';

const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  }),
});
```

**Tool Packages**: Tools are JavaScript objects that can be packaged and distributed via npm. Ready-to-use tool packages include: @exalabs/ai-sdk (web search), @parallel-web/ai-sdk-tools (web search and extract), Stripe agent tools, StackOne ToolSet, agentic (20+ tools), AWS Bedrock AgentCore, Composio (250+ tools), JigsawStack (30+ models), AI Tools Registry, Toolhouse (25+ actions).

**MCP server tools**: Smithery (6,000+ MCPs marketplace), Pipedream (3,000+ integrations), Apify (web scraping, data extraction, browser automation).

## Streaming

Large language models generate long outputs slowly (5-40s latency). Blocking UIs force users to wait for the entire response before displaying anything, causing poor UX. Streaming UIs display response parts as they become available, improving perceived performance and user experience.

Stream text generation using `streamText`:
```ts
import { streamText } from 'ai';

const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a poem about embedding models.',
});

for await (const textPart of textStream) {
  console.log(textPart);
}
```

The `textStream` can be iterated with `for await` to process each text chunk as it arrives. Streaming greatly enhances UX with larger models, but isn't always necessary for smaller, faster models.

### getting_started
Quickstart guides for building streaming chat applications across different JavaScript environments and frameworks using the AI SDK.

## SDK Architecture

Three main components:
1. **Core**: Unified provider-agnostic API for text generation, structured objects, tool calls. Works in Node.js, Deno, Browser.
2. **UI**: Framework-agnostic hooks (`useChat`, `useCompletion`, `useObject`) for React, Vue, Svelte. Production-ready streaming utilities.
3. **RSC**: React Server Components streaming (experimental; use UI for production).

Environment compatibility matrix shows Core works everywhere, UI works in most frameworks, RSC only in Next.js App Router.

## Next.js App Router Quickstart

Setup: `pnpm create next-app@latest`, install `ai@beta @ai-sdk/react@beta zod`, set `AI_GATEWAY_API_KEY` in `.env.local`.

API route (`app/api/chat/route.ts`):
```ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

Key concepts: `UIMessage[]` contains metadata (timestamps, sender info), `convertToModelMessages()` strips it for model, `toUIMessageStreamResponse()` streams result.

UI component (`app/page.tsx`):
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            if (part.type === 'text') return <div key={i}>{part.text}</div>;
          })}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </div>
  );
}
```

`useChat()` provides `messages` (array with id, role, parts) and `sendMessage()`. Message `parts` preserve generation order (text, reasoning, tool calls, etc.).

### Tools

Add to route handler:
```ts
import { tool, stepCountIs } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  stopWhen: stepCountIs(5),
  tools: {
    weather: tool({
      description: 'Get weather in location (fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('Location'),
      }),
      execute: async ({ location }) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return { location, temperature };
      },
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert fahrenheit to celsius',
      inputSchema: z.object({
        temperature: z.number().describe('Temperature in fahrenheit'),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        return { celsius };
      },
    }),
  },
});
```

Tool parts appear as `tool-{toolName}` in message.parts. `stopWhen: stepCountIs(5)` allows up to 5 steps, enabling multi-step tool calling where model uses tool results to trigger follow-up generations.

Update UI to display tool results:
```tsx
case 'tool-weather':
case 'tool-convertFahrenheitToCelsius':
  return <pre key={i}>{JSON.stringify(part, null, 2)}</pre>;
```

## Next.js Pages Router

Identical to App Router except component goes in `pages/index.tsx` instead of `app/page.tsx`. Route handler is `pages/api/chat.ts`.

## Node.js Quickstart

Setup: `mkdir my-ai-app && pnpm init`, install `ai@beta zod dotenv`, create `.env` with `AI_GATEWAY_API_KEY`.

CLI chat agent (`index.ts`):
```ts
import { ModelMessage, streamText } from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: ModelMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');
    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      messages,
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);
```

Uses `streamText()` to stream responses, maintains message history, iterates over `result.textStream` to print tokens in real-time.

### Tools in Node.js

```ts
import { tool } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages,
  tools: {
    weather: tool({
      description: 'Get weather in location (fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('Location'),
      }),
      execute: async ({ location }) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return { location, temperature };
      },
    }),
  },
  stopWhen: stepCountIs(5),
  onStepFinish: async ({ toolResults }) => {
    if (toolResults.length) {
      console.log(JSON.stringify(toolResults, null, 2));
    }
  },
});

console.log(await result.toolCalls);
console.log(await result.toolResults);
```

Access tool calls/results via `result.toolCalls` and `result.toolResults`. `onStepFinish` callback fires after each step.

## Svelte Quickstart

Setup: `npx sv create my-ai-app`, install `ai@beta @ai-sdk/svelte@beta zod`, set `AI_GATEWAY_API_KEY` in `.env.local`.

API route (`src/routes/api/chat/+server.ts`):
```ts
import { streamText, convertToModelMessages, createGateway } from 'ai';
import { AI_GATEWAY_API_KEY } from '$env/static/private';

const gateway = createGateway({ apiKey: AI_GATEWAY_API_KEY });

export async function POST({ request }) {
  const { messages } = await request.json();
  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4.5'),
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

UI component (`src/routes/+page.svelte`):
```svelte
<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  let input = '';
  const chat = new Chat({});
  
  function handleSubmit(event) {
    event.preventDefault();
    chat.sendMessage({ text: input });
    input = '';
  }
</script>

<main>
  <ul>
    {#each chat.messages as message}
      <li>
        <div>{message.role}</div>
        {#each message.parts as part}
          {#if part.type === 'text'}
            <div>{part.text}</div>
          {/if}
        {/each}
      </li>
    {/each}
  </ul>
  <form onsubmit={handleSubmit}>
    <input bind:value={input} />
    <button type="submit">Send</button>
  </form>
</main>
```

Uses `Chat` class (not hooks like React). Svelte-specific: class arguments aren't reactive by default - pass references with getters. Destructuring class properties copies by value, disconnecting from instance. Use `createAIContext()` in root layout for cross-component synchronization.

Tools work same as other frameworks. Tool parts named `tool-{toolName}`.

## Nuxt/Vue Quickstart

Setup: `pnpm create nuxt my-ai-app`, install `ai@beta @ai-sdk/vue@beta zod`, configure in `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    aiGatewayApiKey: '',
  },
});
```

Set `NUXT_AI_GATEWAY_API_KEY` in `.env`.

API route (`server/api/chat.ts`):
```ts
import { streamText, UIMessage, convertToModelMessages, createGateway } from 'ai';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().aiGatewayApiKey;
  if (!apiKey) throw new Error('Missing AI Gateway API key');
  const gateway = createGateway({ apiKey });

  return defineEventHandler(async (event: any) => {
    const { messages }: { messages: UIMessage[] } = await readBody(event);
    const result = streamText({
      model: gateway('anthropic/claude-sonnet-4.5'),
      messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  });
});
```

UI component (`pages/index.vue`):
```vue
<script setup lang="ts">
import { Chat } from "@ai-sdk/vue";
import { ref } from "vue";

const input = ref("");
const chat = new Chat({});

const handleSubmit = (e: Event) => {
    e.preventDefault();
    chat.sendMessage({ text: input.value });
    input.value = "";
};
</script>

<template>
    <div>
        <div v-for="(m, index) in chat.messages" :key="m.id ? m.id : index">
            {{ m.role === "user" ? "User: " : "AI: " }}
            <div v-for="(part, index) in m.parts" :key="`${m.id}-${part.type}-${index}`">
                <div v-if="part.type === 'text'">{{ part.text }}</div>
            </div>
        </div>
        <form @submit="handleSubmit">
            <input v-model="input" placeholder="Say something..." />
        </form>
    </div>
</template>
```

Uses `Chat` class. Tools and multi-step calling work identically to other frameworks.

## Expo Quickstart

Setup: `pnpm create expo-app@latest my-ai-app`, install `ai@beta @ai-sdk/react@beta zod`, set `AI_GATEWAY_API_KEY` in `.env.local`.

API route (`app/api/chat+api.ts`):
```tsx
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
```

UI component (`app/(tabs)/index.tsx`):
```tsx
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useState } from 'react';
import { View, TextInput, ScrollView, Text, SafeAreaView } from 'react-native';

export default function App() {
  const [input, setInput] = useState('');
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
  });

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <View style={{ height: '95%', display: 'flex', flexDirection: 'column', paddingHorizontal: 8 }}>
        <ScrollView style={{ flex: 1 }}>
          {messages.map(m => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <Text style={{ fontWeight: 700 }}>{m.role}</Text>
              {m.parts.map((part, i) => {
                if (part.type === 'text') return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
              })}
            </View>
          ))}
        </ScrollView>
        <View style={{ marginTop: 8 }}>
          <TextInput
            style={{ backgroundColor: 'white', padding: 8 }}
            placeholder="Say something..."
            value={input}
            onChange={e => setInput(e.nativeEvent.text)}
            onSubmitEditing={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }}
            autoFocus={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
```

Uses `useChat()` with `DefaultChatTransport` and `expo/fetch` (required for streaming in Expo 52+). API URL helper:
```ts
import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
  const origin = Constants.experienceUrl.replace('exp://', 'http://');
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  if (process.env.NODE_ENV === 'development') {
    return origin.concat(path);
  }
  
  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL environment variable is not defined');
  }
  
  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};
```

Requires polyfills for `structuredClone` and text encoding. Install `@ungap/structured-clone @stardazed/streams-text-encoding`, create `polyfills.js`:
```ts
import { Platform } from 'react-native';
import structuredClone from '@ungap/structured-clone';

if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import('react-native/Libraries/Utilities/PolyfillFunctions');
    const { TextEncoderStream, TextDecoderStream } = await import('@stardazed/streams-text-encoding');
    
    if (!('structuredClone' in global)) {
      polyfillGlobal('structuredClone', () => structuredClone);
    }
    polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
    polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
  };
  setupPolyfills();
}
```

Import in `_layout.tsx`.

## Provider Configuration

Default provider is Vercel AI Gateway. Access models with string: `model: 'anthropic/claude-sonnet-4.5'`

Explicit import:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

For other providers (e.g., OpenAI):
```bash
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

### agents
LLM agents with tools, loop control, and workflow patterns for multi-step task automation.

## Agents Overview

Agents are LLMs that use tools in a loop to accomplish tasks. Three core components:
- **LLMs** process input and decide next actions
- **Tools** extend capabilities (reading files, calling APIs, writing to databases)
- **Loop** orchestrates execution through context management and stopping conditions

## ToolLoopAgent Class

The main class for building agents. Encapsulates LLM configuration, tools, and behavior into reusable components that handle the agent loop automatically.

**Basic setup:**
```ts
import { ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: {
    weather: tool({
      description: 'Get weather in a location',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temperature: 72 }),
    }),
  },
});

const result = await agent.generate({ prompt: 'What is the weather in San Francisco?' });
console.log(result.text); // agent's final answer
console.log(result.steps); // steps taken
```

**Configuration options:**
- `model`: LLM to use
- `instructions`: System instructions defining behavior, personality, constraints
- `tools`: Object of tool definitions with description, inputSchema (Zod), and execute function
- `stopWhen`: Stop conditions (default: `stepCountIs(20)`). Built-in: `stepCountIs(n)`, `hasToolCall('toolName')`. Custom conditions receive step info.
- `toolChoice`: 'auto' (default), 'none', 'required', or `{ type: 'tool', toolName: 'name' }`
- `output`: Structured output schema using `Output.object({ schema: z.object(...) })`
- `prepareStep`: Callback before each step to dynamically modify model, tools, messages, settings. Receives `{ model, stepNumber, steps, messages }`. Can be async.
- `callOptionsSchema`: Zod schema for type-safe runtime configuration
- `prepareCall`: Function to modify agent settings based on call options

**Usage methods:**
```ts
// One-time generation
const result = await agent.generate({ prompt: '...', options: { /* call options */ } });

// Streaming
const stream = agent.stream({ prompt: '...' });
for await (const chunk of stream.textStream) { console.log(chunk); }

// API response for UI
import { createAgentUIStreamResponse } from 'ai';
export async function POST(request: Request) {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({ agent: myAgent, messages });
}

// Type-safe UI messages
import { InferAgentUIMessage } from 'ai';
export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```

## Loop Control

**Stop conditions:**
```ts
import { stepCountIs } from 'ai';

const agent = new ToolLoopAgent({
  model: '...',
  stopWhen: stepCountIs(20), // or combine: [stepCountIs(20), customCondition]
});

// Custom condition
const hasAnswer = ({ steps }) => steps.some(step => step.text?.includes('ANSWER:'));
const budgetExceeded = ({ steps }) => {
  const totalUsage = steps.reduce((acc, step) => ({
    inputTokens: acc.inputTokens + (step.usage?.inputTokens ?? 0),
    outputTokens: acc.outputTokens + (step.usage?.outputTokens ?? 0),
  }), { inputTokens: 0, outputTokens: 0 });
  return (totalUsage.inputTokens * 0.01 + totalUsage.outputTokens * 0.03) / 1000 > 0.5;
};
```

**Prepare step callback:**
```ts
const agent = new ToolLoopAgent({
  model: '...',
  prepareStep: async ({ stepNumber, messages, steps }) => {
    // Dynamic model selection
    if (stepNumber > 2 && messages.length > 10) {
      return { model: 'anthropic/claude-sonnet-4.5' };
    }
    // Context management - keep recent messages
    if (messages.length > 20) {
      return { messages: [messages[0], ...messages.slice(-10)] };
    }
    // Tool selection by phase
    if (stepNumber <= 2) return { activeTools: ['search'], toolChoice: 'required' };
    if (stepNumber <= 5) return { activeTools: ['analyze'] };
    return { activeTools: ['summarize'], toolChoice: 'required' };
  },
});
```

**Manual loop control** for complete control:
```ts
import { generateText } from 'ai';

const messages = [{ role: 'user', content: '...' }];
let step = 0;
const maxSteps = 10;

while (step < maxSteps) {
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
    tools: { /* tools */ },
  });
  messages.push(...result.response.messages);
  if (result.text) break;
  step++;
}
```

## Call Options (Runtime Configuration)

Pass type-safe structured inputs to dynamically modify agent behavior per request without creating multiple instances.

```ts
const agent = new ToolLoopAgent({
  model: 'openai/gpt-4o-mini',
  callOptionsSchema: z.object({
    userId: z.string(),
    accountType: z.enum(['free', 'pro', 'enterprise']),
    complexity: z.enum(['simple', 'complex']),
    userCity: z.string().optional(),
  }),
  instructions: 'You are a helpful assistant.',
  prepareCall: async ({ options, ...settings }) => {
    // Dynamic model selection
    const model = options.complexity === 'simple' ? 'openai/gpt-4o-mini' : 'openai/o1-mini';
    
    // Inject user context
    const instructions = settings.instructions + `\nUser: ${options.userId} (${options.accountType})`;
    
    // Dynamic tool configuration
    const tools = {
      search: openai.tools.webSearch({
        userLocation: { city: options.userCity, country: 'US' },
      }),
    };
    
    // Provider-specific options
    const providerOptions = {
      openai: { reasoningEffort: options.complexity === 'complex' ? 'high' : 'low' },
    };
    
    return { model, instructions, tools, providerOptions };
  },
});

await agent.generate({
  prompt: 'Help me with something',
  options: { userId: 'user_123', accountType: 'pro', complexity: 'complex', userCity: 'SF' },
});
```

## Workflow Patterns

Five core patterns for building reliable agent workflows:

**Sequential Processing (Chains):** Steps execute in order, each output feeds into next. Use for well-defined sequences.
```ts
const { text: copy } = await generateText({ model, prompt: `Write marketing copy for: ${input}` });
const { object: metrics } = await generateObject({
  model, schema: z.object({ hasCallToAction: z.boolean(), emotionalAppeal: z.number().min(1).max(10) }),
  prompt: `Evaluate: ${copy}`,
});
if (!metrics.hasCallToAction || metrics.emotionalAppeal < 7) {
  const { text: improved } = await generateText({ model, prompt: `Rewrite with improvements...` });
  return { copy: improved, metrics };
}
```

**Routing:** Model decides which path based on context. First LLM call's results determine subsequent model size and system prompt.
```ts
const { object: classification } = await generateObject({
  model: 'openai/gpt-4o',
  schema: z.object({ type: z.enum(['general', 'refund', 'technical']), complexity: z.enum(['simple', 'complex']) }),
  prompt: `Classify: ${query}`,
});
const { text: response } = await generateText({
  model: classification.complexity === 'simple' ? 'openai/gpt-4o-mini' : 'openai/o1-mini',
  system: { general: '...', refund: '...', technical: '...' }[classification.type],
  prompt: query,
});
```

**Parallel Processing:** Independent subtasks execute simultaneously.
```ts
const [securityReview, performanceReview, maintainabilityReview] = await Promise.all([
  generateObject({ model, system: 'Security expert...', schema: z.object({ vulnerabilities: z.array(z.string()), riskLevel: z.enum(['low', 'medium', 'high']) }), prompt: `Review: ${code}` }),
  generateObject({ model, system: 'Performance expert...', schema: z.object({ issues: z.array(z.string()), impact: z.enum(['low', 'medium', 'high']) }), prompt: `Review: ${code}` }),
  generateObject({ model, system: 'Quality expert...', schema: z.object({ concerns: z.array(z.string()), qualityScore: z.number().min(1).max(10) }), prompt: `Review: ${code}` }),
]);
const { text: summary } = await generateText({ model, system: 'Summarize reviews...', prompt: `Synthesize: ${JSON.stringify([...], null, 2)}` });
```

**Orchestrator-Worker:** Primary model (orchestrator) coordinates specialized workers. Each worker optimizes for specific subtask while orchestrator maintains overall context.
```ts
const { object: plan } = await generateObject({
  model: 'openai/o4-mini',
  schema: z.object({ files: z.array(z.object({ purpose: z.string(), filePath: z.string(), changeType: z.enum(['create', 'modify', 'delete']) })), estimatedComplexity: z.enum(['low', 'medium', 'high']) }),
  system: 'Senior architect...',
  prompt: `Analyze feature: ${featureRequest}`,
});
const fileChanges = await Promise.all(
  plan.files.map(file => generateObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: z.object({ explanation: z.string(), code: z.string() }),
    system: { create: '...', modify: '...', delete: '...' }[file.changeType],
    prompt: `Implement ${file.filePath}...`,
  })),
);
```

**Evaluator-Optimizer:** Dedicated evaluation steps assess intermediate results. Based on evaluation, workflow proceeds, retries with adjusted parameters, or takes corrective action.
```ts
let translation = (await generateText({ model, system: 'Literary translator...', prompt: `Translate to ${lang}: ${text}` })).text;
for (let i = 0; i < 3; i++) {
  const { object: eval } = await generateObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: z.object({ qualityScore: z.number().min(1).max(10), preservesTone: z.boolean(), specificIssues: z.array(z.string()), improvementSuggestions: z.array(z.string()) }),
    system: 'Evaluate translations...',
    prompt: `Evaluate: Original: ${text}, Translation: ${translation}`,
  });
  if (eval.qualityScore >= 8 && eval.preservesTone) break;
  translation = (await generateText({ model: 'anthropic/claude-sonnet-4.5', system: 'Literary translator...', prompt: `Improve: ${eval.specificIssues.join('\n')}...` })).text;
}
```

## Benefits

- **Reduces boilerplate** - Manages loops and message arrays
- **Improves reusability** - Define once, use throughout application
- **Simplifies maintenance** - Single place to update agent configuration
- **Full TypeScript support** - Type inference for UI messages and tools

For non-deterministic workflows, use agents. For reliable, repeatable outcomes with explicit control flow, use core functions with structured workflow patterns.

### core_functions
Complete reference for AI SDK's core text/object generation, tool calling, embeddings, reranking, image/speech/transcription, middleware, provider management, and testing utilities.

## Core Functions Reference

AI SDK Core provides four main functions for LLM integration:

**Text Generation:**
- `generateText()`: Non-interactive text generation (automation, email drafting, summarization, agents). Returns complete text with callbacks `onFinish`, `onError`.
- `streamText()`: Interactive streaming with backpressure. Streams text as generated. Supports `onError`, `onChunk`, `onFinish` callbacks. Access all events via `fullStream` property with types: `start`, `text-start`, `text-delta`, `text-end`, `reasoning-start/delta/end`, `source`, `file`, `tool-call`, `tool-input-start/delta/end`, `tool-result`, `tool-error`, `finish-step`, `finish`, `error`, `raw`.

**Structured Data Generation:**
- `generateObject()`: Generates typed objects matching Zod/Valibot/JSON schemas. Supports output strategies: `object` (default), `array`, `enum`, `no-schema`. Throws `NoObjectGeneratedError` with preserved text, response, usage, cause. Experimental `experimental_repairText` for JSON repair.
- `streamObject()`: Streams structured objects. Use `elementStream` for arrays, `partialObjectStream` for objects. Errors part of stream via `onError`.

**Tool Calling:**
Tools are objects with `description`, `inputSchema` (Zod/JSON), optional `execute` async function. Pass as object with tool names as keys.

Multi-step tool calls via `stopWhen` (e.g., `stepCountIs(5)`). Callbacks: `onStepFinish({ text, toolCalls, toolResults, finishReason, usage })`, `prepareStep({ model, stepNumber, steps, messages })` for modifying settings per step.

Tool choice control: `auto` (default), `required`, `none`, `{ type: 'tool', toolName }`.

Tool execution receives second parameter with: `toolCallId`, `messages` (history), `abortSignal`, `experimental_context`.

Dynamic tools via `dynamicTool()` for unknown schemas. Type-safe handling with `toolCall.dynamic` flag.

Preliminary results: return `AsyncIterable` from `execute()` to stream multiple results.

Tool input lifecycle hooks (streamText only): `onInputStart`, `onInputDelta`, `onInputAvailable`.

Error handling: `NoSuchToolError`, `InvalidToolInputError`, `ToolCallRepairError`. Tool execution errors appear as `tool-error` parts in steps.

Experimental `experimental_repairToolCall` to fix invalid calls without additional steps.

Active tools: limit available tools via `activeTools: ['toolName']` while maintaining static typing.

Multi-modal tool results (Anthropic/OpenAI): use optional `toModelOutput` function to convert results to content parts.

Helper types: `TypedToolCall<typeof toolSet>`, `TypedToolResult<typeof toolSet>` for type-safe definitions outside generateText/streamText.

**MCP Tools:**
Connect to Model Context Protocol servers via `experimental_createMCPClient()` with transport options: HTTP (recommended), SSE, stdio, or custom.

Schema discovery: `await mcpClient.tools()` lists all server tools. Schema definition: explicit type-safe definitions via `schemas` parameter.

Resources: `listResources()`, `readResource({ uri })`, `listResourceTemplates()`.

Prompts: `listPrompts()`, `getPrompt({ name, arguments })`.

Elicitation: enable with `capabilities: { elicitation: {} }`, register handler via `onElicitationRequest()`.

**Common Settings:**
- Output: `maxOutputTokens`, `temperature` (0=deterministic), `topP`, `topK`, `stopSequences`, `seed`
- Penalties: `presencePenalty`, `frequencyPenalty`
- Request: `maxRetries` (default 2), `abortSignal` (for timeout/cancellation), `headers` (HTTP requests)

**Embeddings:**
- `embed()`: Single value embedding
- `embedMany()`: Batch embedding with `maxParallelCalls` concurrency control
- `cosineSimilarity()`: Calculate similarity between vectors
- Configuration: `providerOptions`, `maxRetries`, `abortSignal`, `headers`

**Reranking:**
`rerank()` reorders documents by query relevance. Returns `ranking` array with `{ originalIndex, score, document }` and `rerankedDocuments`. Supports string/JSON documents, `topN` limiting, provider options, retries, abort signals, headers.

**Image Generation:**
`experimental_generateImage()` generates images from text. Supports `size` (e.g., '1024x1024') or `aspectRatio` (e.g., '16:9'). Batch generation via `n` parameter with automatic request batching. Seed for reproducibility. Provider options, abort signals, headers. Returns `image` (single) or `images` (batch) with `base64`, `uint8Array`. Error: `NoImageGeneratedError`.

**Transcription:**
`experimental_transcribe()` transcribes audio to text. Audio input: Uint8Array, ArrayBuffer, Buffer, base64 string, or URL. Returns `text`, `segments` (with timestamps), `language`, `durationInSeconds`. Provider options, abort signals, headers, warnings. Error: `NoTranscriptGeneratedError`.

**Speech Generation:**
`experimental_generateSpeech()` converts text to audio. Configurable `voice`, `language`. Returns `audioData` (Uint8Array). Provider options, abort signals, headers, warnings. Error: `NoSpeechGeneratedError`.

**Prompt Engineering Tips:**
- Use strong tool-calling models (gpt-4, gpt-4.1)
- Keep tool count ≤5, minimal parameter complexity
- Use meaningful names for tools, parameters, properties
- Add `.describe("...")` to Zod schema properties
- Document tool output in description when unclear
- Include JSON examples of tool calls in prompts

Zod schema patterns:
- Dates: use `z.string().date().transform(v => new Date(v))` (models return strings)
- Optional params: use `.nullable()` instead of `.optional()` for strict validation
- Temperature: use `temperature: 0` for deterministic tool calls and object generation

**Debugging:**
- Check `result.warnings` for provider support
- Inspect raw requests via `result.request.body`

**Middleware:**
Wrap models with `wrapLanguageModel({ model, middleware })` to intercept/modify calls. Built-in: `extractReasoningMiddleware`, `simulateStreamingMiddleware`, `defaultSettingsMiddleware`. Custom implementations via `transformParams`, `wrapGenerate`, `wrapStream`. Examples: logging, caching, RAG, guardrails. Pass per-request metadata via `providerOptions`.

**Provider Management:**
- Custom providers: `customProvider()` for pre-configured settings, aliases, model limits
- Provider registry: `createProviderRegistry()` for managing multiple providers, access via string IDs (e.g., 'openai:gpt-5.1')
- Global default: set `globalThis.AI_SDK_DEFAULT_PROVIDER`

**Error Handling:**
- Regular errors: try/catch
- Streaming errors (simple): try/catch
- Full streams: switch on `part.type` for `error`, `abort`, `tool-error`
- Stream abort: `onAbort({ steps })` callback for cleanup

**Testing:**
Mock providers from `ai/test`: `MockLanguageModelV3`, `MockEmbeddingModelV3`. Test helpers: `mockId`, `mockValues`, `simulateReadableStream` for deterministic unit testing without calling real providers.

**Telemetry:**
OpenTelemetry integration via `experimental_telemetry: { isEnabled: true }`. Control input/output recording with `recordInputs`, `recordOutputs`. Provide `functionId` and `metadata` for context. Custom `tracer` for different TracerProvider. Records spans for text/object generation, embedding with detailed attributes: model, tokens, responses, tool calls, timing.

### ui_hooks_&_components
React/Svelte/Vue/Angular hooks for building AI-driven UIs: useChat (streaming chat with message state, tools, metadata, persistence, resumption), useCompletion (text completions), useObject (structured JSON). Message parts include text, tool calls, reasoning, sources, files. Tool types: server auto-execute, client auto-execute, user-interaction. Custom data streaming with reconciliation. Error handling and transport customization.

## Overview
Framework-agnostic toolkit for building interactive AI-driven UIs with three main hooks: `useChat` for conversational interfaces, `useCompletion` for text completions, and `useObject` for structured JSON generation. Supports React, Svelte, Vue.js, and Angular with varying feature support.

## useChat Hook
Real-time streaming chat with message state management. Core features:
- Message streaming with `parts` array (text, tool calls, tool results, reasoning, sources, files)
- State: `submitted`, `streaming`, `ready`, `error`
- Methods: `sendMessage()`, `stop()`, `regenerate()`, `setMessages()`
- Callbacks: `onFinish`, `onError`, `onData`
- UI customization: status handling, error display, message editing/deletion, cancellation

### Configuration
**Hook-level** (all requests):
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: { Authorization: 'token' },
    body: { user_id: '123' },
    credentials: 'same-origin',
  }),
});
```

**Dynamic** (for refreshing tokens):
```tsx
transport: new DefaultChatTransport({
  headers: () => ({ Authorization: `Bearer ${getAuthToken()}` }),
  body: () => ({ sessionId: getCurrentSessionId() }),
})
```

**Request-level** (per-message, takes precedence):
```tsx
sendMessage({ text: input }, {
  headers: { Authorization: 'Bearer token123' },
  body: { temperature: 0.7, user_id: '123' },
  metadata: { userId: 'user123', sessionId: 'session456' },
});
```

### Transport & Request Transformation
Custom request format via `prepareSendMessagesRequest`:
```tsx
transport: new DefaultChatTransport({
  prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
    if (trigger === 'submit-user-message') {
      return { body: { id, message: messages[messages.length - 1] } };
    } else if (trigger === 'regenerate-assistant-message') {
      return { body: { id, messageId } };
    }
  },
})
```

Server handles different triggers and loads/modifies message history accordingly.

### Message Metadata
Attach custom data to messages (timestamps, model info, token usage):
```ts
// Server
return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === 'start') return { createdAt: Date.now(), model: 'gpt-5.1' };
    if (part.type === 'finish') return { totalTokens: part.totalUsage.totalTokens };
  },
});

// Client
{messages.map(message => (
  <div key={message.id}>
    {message.metadata?.createdAt && new Date(message.metadata.createdAt).toLocaleTimeString()}
    {message.parts.map(part => part.type === 'text' ? part.text : null)}
    {message.metadata?.totalTokens && <span>{message.metadata.totalTokens} tokens</span>}
  </div>
))}
```

### Advanced Features
**Reasoning tokens** (DeepSeek, Claude 3.7):
```ts
return result.toUIMessageStreamResponse({ sendReasoning: true });
// Client: message.parts includes { type: 'reasoning', text: '...' }
```

**Sources** (Perplexity, Google):
```ts
return result.toUIMessageStreamResponse({ sendSources: true });
// Client: message.parts includes { type: 'source-url', url, title } or { type: 'source-document', title }
```

**Image generation** (Gemini 2.5):
```tsx
{message.parts.map(part => 
  part.type === 'file' && part.mediaType.startsWith('image/') 
    ? <img src={part.url} alt="Generated" />
    : null
)}
```

**File attachments**:
```tsx
const [files, setFiles] = useState<FileList>();
sendMessage({ text: input, files }); // Auto-converts image/* and text/* to multi-modal parts

// Or pre-uploaded files:
sendMessage({ text: input, files: [{ type: 'file', filename: 'earth.png', mediaType: 'image/png', url: 'https://...' }] });
```

**Tool type inference**:
```tsx
import { InferUITool, InferUITools } from 'ai';

const weatherTool = { description: '...', inputSchema: z.object(...), execute: async (...) => ... };
type WeatherUITool = InferUITool<typeof weatherTool>; // { input: {...}; output: string }

const tools = { weather: {...}, calculator: {...} } satisfies ToolSet;
type MyUITools = InferUITools<typeof tools>;
type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;
```

**Throttle UI updates** (React only):
```tsx
const { messages } = useChat({ experimental_throttle: 50 }); // milliseconds
```

## Message Persistence
Store and load chat messages with unique IDs:

```tsx
// Create new chat
const id = await createChat(); // generates ID, creates empty message file
redirect(`/chat/${id}`);

// Load existing chat
const messages = await loadChat(id);

// Page component
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const messages = await loadChat(id);
  return <Chat id={id} initialMessages={messages} />;
}

// Chat component
export default function Chat({ id, initialMessages }: { id?: string; initialMessages?: UIMessage[] }) {
  const { sendMessage, messages } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  // ...
}
```

**Validate messages on server** (with tools/metadata):
```ts
import { validateUIMessages } from 'ai';

const validatedMessages = await validateUIMessages({
  messages: [...previousMessages, newMessage],
  tools,
  dataPartsSchema,
  metadataSchema,
});

const result = streamText({
  model: 'openai/gpt-5-mini',
  messages: convertToModelMessages(validatedMessages),
  tools,
});

return result.toUIMessageStreamResponse({
  originalMessages: validatedMessages,
  onFinish: ({ messages }) => saveChat({ chatId: id, messages }),
});
```

**Server-side message ID generation** (for consistency):
```ts
// Option 1: generateMessageId in toUIMessageStreamResponse
return result.toUIMessageStreamResponse({
  generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
  onFinish: ({ messages }) => saveChat({ chatId, messages }),
});

// Option 2: createUIMessageStream with manual ID
const stream = createUIMessageStream({
  execute: ({ writer }) => {
    writer.write({ type: 'start', messageId: generateId() });
    writer.merge(result.toUIMessageStream({ sendStart: false }));
  },
  onFinish: ({ responseMessage }) => { /* save */ },
});
```

**Optimize data sent** - send only last message:
```tsx
transport: new DefaultChatTransport({
  api: '/api/chat',
  prepareSendMessagesRequest({ messages, id }) {
    return { body: { message: messages[messages.length - 1], id } };
  },
})

// Server loads previous messages and appends new one
const previousMessages = await loadChat(id);
const validatedMessages = await validateUIMessages({
  messages: [...previousMessages, message],
  tools,
});
```

**Handle client disconnects** - consume stream on backend:
```ts
const result = streamText({ model, messages: convertToModelMessages(messages) });
result.consumeStream(); // runs to completion regardless of client disconnect

return result.toUIMessageStreamResponse({
  originalMessages: messages,
  onFinish: ({ messages }) => saveChat({ chatId, messages }),
});
```

## Stream Resumption
Resume ongoing streams after page reloads for long-running generations. Requires Redis and `resumable-stream` package.

**Warning**: Incompatible with abort functionality.

```tsx
// Client: enable resumption
const { messages, sendMessage } = useChat({
  id: chatData.id,
  messages: chatData.messages,
  resume: true,
  transport: new DefaultChatTransport({
    prepareSendMessagesRequest: ({ id, messages }) => ({
      body: { id, message: messages[messages.length - 1] },
    }),
  }),
});

// POST handler: create resumable stream
export async function POST(req: Request) {
  const { message, id } = await req.json();
  const chat = await readChat(id);
  const messages = [...chat.messages, message];
  
  saveChat({ id, messages, activeStreamId: null });

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: ({ messages }) => saveChat({ id, messages, activeStreamId: null }),
    async consumeSseStream({ stream }) {
      const streamId = generateId();
      const streamContext = createResumableStreamContext({ waitUntil: after });
      await streamContext.createNewResumableStream(streamId, () => stream);
      saveChat({ id, activeStreamId: streamId });
    },
  });
}

// GET handler: resume stream
export async function GET(_, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chat = await readChat(id);

  if (chat.activeStreamId == null) return new Response(null, { status: 204 });

  const streamContext = createResumableStreamContext({ waitUntil: after });
  return new Response(
    await streamContext.resumeExistingStream(chat.activeStreamId),
    { headers: UI_MESSAGE_STREAM_HEADERS },
  );
}

// Customize resume endpoint
const { messages } = useChat({
  resume,
  transport: new DefaultChatTransport({
    prepareReconnectToStreamRequest: ({ id }) => ({
      api: `/api/chat/${id}/stream`,
      credentials: 'include',
      headers: { Authorization: 'Bearer token' },
    }),
  }),
});
```

## Tool Usage
Three tool types: server auto-execute, client auto-execute, user-interaction.

```tsx
// API route
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
    tools: {
      getWeatherInformation: {
        description: 'show the weather in a given city',
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }) => {
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        },
      },
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        inputSchema: z.object({ message: z.string() }),
      },
      getLocation: {
        description: 'Get the user location.',
        inputSchema: z.object({}),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}

// Client
export default function Chat() {
  const { messages, sendMessage, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      
      if (toolCall.toolName === 'getLocation') {
        const cities = ['New York', 'Los Angeles', 'Chicago'];
        addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: cities[Math.floor(Math.random() * cities.length)],
        });
      }
    },
  });

  return (
    <>
      {messages?.map(message => (
        <div key={message.id}>
          <strong>{message.role}: </strong>
          {message.parts.map(part => {
            switch (part.type) {
              case 'text':
                return part.text;
              case 'tool-askForConfirmation': {
                const callId = part.toolCallId;
                switch (part.state) {
                  case 'input-streaming':
                    return <div key={callId}>Loading...</div>;
                  case 'input-available':
                    return (
                      <div key={callId}>
                        {part.input.message}
                        <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'Yes' })}>Yes</button>
                        <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'No' })}>No</button>
                      </div>
                    );
                  case 'output-available':
                    return <div key={callId}>Confirmed: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error: {part.errorText}</div>;
                }
                break;
              }
              case 'tool-getWeatherInformation': {
                const callId = part.toolCallId;
                switch (part.state) {
                  case 'input-available':
                    return <div key={callId}>Getting weather for {part.input.city}...</div>;
                  case 'output-available':
                    return <div key={callId}>Weather in {part.input.city}: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error: {part.errorText}</div>;
                }
                break;
              }
              case 'dynamic-tool':
                return (
                  <div key={part.toolCallId}>
                    <h4>Tool: {part.toolName}</h4>
                    {part.state === 'output-available' && <pre>{JSON.stringify(part.output, null, 2)}</pre>}
                    {part.state === 'output-error' && <div>Error: {part.errorText}</div>}
                  </div>
                );
            }
          })}
        </div>
      ))}
      <form onSubmit={e => { e.preventDefault(); sendMessage({ text: input }); }}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </>
  );
}
```

**Error handling**:
```tsx
async onToolCall({ toolCall }) {
  if (toolCall.toolName === 'getWeatherInformation') {
    try {
      const weather = await getWeatherInformation(toolCall.input);
      addToolOutput({ tool: 'getWeatherInformation', toolCallId: toolCall.toolCallId, output: weather });
    } catch (err) {
      addToolOutput({
        tool: 'getWeatherInformation',
        toolCallId: toolCall.toolCallId,
        state: 'output-error',
        errorText: 'Unable to get weather',
      });
    }
  }
}
```

**Multi-step tool calls**:
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  tools: { /* all with execute functions */ },
  stopWhen: stepCountIs(5),
});
```

**Step boundaries in UI**:
```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'step-start':
      return index > 0 ? <div key={index}><hr /></div> : null;
    // ...
  }
});
```

## Generative UI
Connect LLM tool calls to React components for dynamic UI generation.

```tsx
// Define tools
export const weatherTool = createTool({
  description: 'Display the weather for a location',
  inputSchema: z.object({ location: z.string() }),
  execute: async ({ location }) => ({ weather: 'Sunny', temperature: 75, location }),
});

// Create components
export const Weather = ({ temperature, weather, location }: WeatherProps) => (
  <div>
    <h2>Weather for {location}</h2>
    <p>Condition: {weather}</p>
    <p>Temperature: {temperature}°C</p>
  </div>
);

// Render by checking message.parts for tool-${toolName}
{message.parts.map((part, index) => {
  if (part.type === 'tool-displayWeather') {
    switch (part.state) {
      case 'input-available':
        return <div key={index}>Loading weather...</div>;
      case 'output-available':
        return <div key={index}><Weather {...part.output} /></div>;
      case 'output-error':
        return <div key={index}>Error: {part.errorText}</div>;
    }
  }
})}
```

## useCompletion Hook
Streams text completions with state management.

```tsx
const { completion, input, handleInputChange, handleSubmit, isLoading, error, stop } = useCompletion({
  api: '/api/completion',
  onResponse: (response) => { /* ... */ },
  onFinish: (prompt, completion) => { /* ... */ },
  onError: (error) => { /* ... */ },
  experimental_throttle: 50, // React only
});

return (
  <form onSubmit={handleSubmit}>
    <input name="prompt" value={input} onChange={handleInputChange} disabled={isLoading} />
    <button type="submit" disabled={isLoading}>Submit</button>
    {isLoading && <button onClick={stop}>Stop</button>}
    {error && <div>{error.message}</div>}
    <div>{completion}</div>
  </form>
);
```

Server:
```ts
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = streamText({ model: 'anthropic/claude-sonnet-4.5', prompt });
  return result.toTextStreamResponse();
}
```

## useObject Hook
Streams structured JSON generation with partial results.

```tsx
import { experimental_useObject as useObject } from '@ai-sdk/react';

const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string(),
      message: z.string(),
    }),
  ),
});

const { object, submit, isLoading, error, stop } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
  onFinish({ object, error }) { /* ... */ },
  onError(error) { /* ... */ },
});

return (
  <>
    <button onClick={() => submit('Messages during finals week.')} disabled={isLoading}>
      Generate notifications
    </button>
    {isLoading && <button onClick={stop}>Stop</button>}
    {error && <div>Error</div>}
    {object?.notifications?.map((notification, index) => (
      <div key={index}>
        <p>{notification?.name}</p>
        <p>{notification?.message}</p>
      </div>
    ))}
  </>
);
```

Server:
```ts
export async function POST(req: Request) {
  const context = await req.json();
  const result = streamObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: notificationSchema,
    prompt: `Generate 3 notifications: ${context}`,
  });
  return result.toTextStreamResponse();
}
```

**Enum mode** (classification):
```tsx
const { object, submit } = useObject({
  api: '/api/classify',
  schema: z.object({ enum: z.enum(['true', 'false']) }),
});

// Server
const result = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['true', 'false'],
  prompt: `Classify: ${context}`,
});
```

## Custom Data Streaming
Stream custom data alongside model responses using Server-Sent Events.

```tsx
// Define types
export type MyUIMessage = UIMessage<
  never,
  {
    weather: { city: string; weather?: string; status: 'loading' | 'success' };
    notification: { message: string; level: 'info' | 'warning' | 'error' };
  }
>;

// Server: stream data with createUIMessageStream
const stream = createUIMessageStream<MyUIMessage>({
  execute: ({ writer }) => {
    // Transient data (won't be in history)
    writer.write({
      type: 'data-notification',
      data: { message: 'Processing...', level: 'info' },
      transient: true,
    });

    // Persistent data with loading state
    writer.write({
      type: 'data-weather',
      id: 'weather-1',
      data: { city: 'San Francisco', status: 'loading' },
    });

    const result = streamText({ /* ... */ });
    
    result.onFinish(() => {
      // Update same data part by ID (reconciliation)
      writer.write({
        type: 'data-weather',
        id: 'weather-1',
        data: { city: 'San Francisco', weather: 'sunny', status: 'success' },
      });
    });

    writer.merge(result.toUIMessageStream());
  },
});

return createUIMessageStreamResponse({ stream });

// Client: access via onData callback and message.parts
const { messages } = useChat<MyUIMessage>({
  api: '/api/chat',
  onData: dataPart => {
    if (dataPart.type === 'data-notification') {
      showToast(dataPart.data.message, dataPart.data.level);
    }
  },
});

{messages?.map(message => (
  <div key={message.id}>
    {message.parts
      .filter(part => part.type === 'data-weather')
      .map((part, index) => (
        <div key={index}>
          {part.data.status === 'loading' ? (
            <>Getting weather for {part.data.city}...</>
          ) : (
            <>Weather in {part.data.city}: {part.data.weather}</>
          )}
        </div>
      ))}
    {message.parts
      .filter(part => part.type === 'text')
      .map((part, index) => <div key={index}>{part.text}</div>)}
  </div>
))}
```

## Stream Protocols
Two protocols: text streams (plain text) and data streams (SSE with structured parts).

**Text Stream** - plain text chunks:
```tsx
const { messages, sendMessage } = useChat({
  transport: new TextStreamChatTransport({ api: '/api/chat' }),
});

// Server
return result.toTextStreamResponse();
```

**Data Stream** (default) - SSE with parts (text, tool calls, reasoning, sources, files, custom data):
```tsx
// Server
return result.toUIMessageStreamResponse();
```

Data streams support tool calls, usage info, finish reasons. Text streams don't.

## Reading UIMessage Streams
Transform stream of UIMessageChunk objects into AsyncIterableStream<UIMessage> for iterative processing.

```tsx
import { readUIMessageStream, streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get weather',
      inputSchema: z.object({ location: z.string() }),
      execute: ({ location }) => ({ location, temperature: 72 }),
    }),
  },
  prompt: 'What is the weather in Tokyo?',
});

for await (const uiMessage of readUIMessageStream({
  stream: result.toUIMessageStream(),
})) {
  uiMessage.parts.forEach(part => {
    switch (part.type) {
      case 'text':
        console.log('Text:', part.text);
        break;
      case 'tool-call':
        console.log('Tool:', part.toolName, 'args:', part.args);
        break;
      case 'tool-result':
        console.log('Result:', part.result);
        break;
    }
  });
}

// Resume from previous message
for await (const uiMessage of readUIMessageStream({
  stream: result.toUIMessageStream(),
  message: lastMessage,
})) {
  console.log('Resumed:', uiMessage);
}
```

## Error Handling
Control warnings and handle errors in UI.

```tsx
// Disable warnings
globalThis.AI_SDK_LOG_WARNINGS = false;

// Custom warning handler
globalThis.AI_SDK_LOG_WARNINGS = ({ warnings, provider, model }) => {
  // Handle warnings
};

// Handle errors in UI
const { messages, sendMessage, error, regenerate } = useChat();

return (
  <div>
    {messages.map(m => <div key={m.id}>{m.role}: {m.parts.filter(p => p.type === 'text').map(p => p.text).join('')}</div>)}
    {error && (
      <>
        <div>An error occurred.</div>
        <button onClick={() => regenerate()}>Retry</button>
      </>
    )}
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={e => setInput(e.target.value)} disabled={error != null} />
    </form>
  </div>
);

// Error callback
const { /* ... */ } = useChat({
  onError: error => console.error(error),
});

// Replace last message on error
const { sendMessage, error, messages, setMessages } = useChat();
function customSubmit(event: React.FormEvent) {
  event.preventDefault();
  if (error != null) setMessages(messages.slice(0, -1));
  sendMessage({ text: input });
}
```

## Transport
Configure HTTP communication for useChat.

```tsx
// Default: POST to /api/chat
const { messages, sendMessage } = useChat();

// Custom transport
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: { Authorization: 'Bearer token', 'X-API-Version': '2024-01' },
    credentials: 'include',
  }),
});

// Dynamic configuration (for refreshing tokens)
transport: new DefaultChatTransport({
  api: '/api/chat',
  headers: () => ({ Authorization: `Bearer ${getAuthToken()}` }),
  body: () => ({ sessionId: getCurrentSessionId() }),
  credentials: () => 'include',
})

// Request transformation
transport: new DefaultChatTransport({
  api: '/api/chat',
  prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
    return {
      headers: { 'X-Session-ID': id },
      body: { messages: messages.slice(-10), trigger, messageId },
    };
  },
})
```


### react_server_components
Experimental RSC integration for streaming React Server Components and generative UI with state split between serializable AI State and client-only UI State.

## Experimental RSC Integration for Generative UI

Experimental package (`@ai-sdk/rsc`) for building AI applications with React Server Components. RSCs render UI on the server and stream to client; combined with Server Actions, they enable LLMs to generate and stream UI directly.

### Core Functions

**Generative UI:**
- `streamUI`: calls a model and allows it to respond with React Server Components. Tools return components via async generator functions that yield loading states before final UI.
- `useUIState`: client hook returning current UI state and update function (like `useState`). UI State is the visual representation of AI state, can contain React elements.
- `useAIState`: client hook returning current AI state and update function. AI state is serializable JSON containing context shared with model (system messages, function responses, conversation history).
- `useActions`: provides access to Server Actions from client for user interactions.
- `createAI`: creates a client-server context provider managing UI and AI states with callbacks for persistence.

**Streaming Values:**
- `createStreamableValue`: creates a stream sending serializable values (strings, numbers, objects, arrays) from server to client. Read with `readStreamableValue` async iterator.
- `createStreamableUI`: creates a stream sending React components from server to client. Call `.update()` for intermediate states, `.done()` to finalize.

### State Management

Split state into two parts:
- **AI State**: Serializable JSON (conversation history, metadata) accessible/modifiable from server and client. Source of truth passed to LLM.
- **UI State**: Client-only state containing rendered UI elements and React components.

Setup with `createAI`:
```tsx
export type ServerMessage = { role: 'user' | 'assistant'; content: string };
export type ClientMessage = { id: string; role: 'user' | 'assistant'; display: ReactNode };

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  initialAIState: [],
  initialUIState: [],
  actions: { sendMessage },
  onSetAIState: async ({ state, done }) => {
    if (done) saveChatToDB(state);
  },
  onGetUIState: async () => {
    const historyFromDB = await loadChatFromDB();
    return historyFromDB.map(({ role, content }) => ({
      id: generateId(),
      role,
      display: role === 'function' ? <Component {...JSON.parse(content)} /> : content,
    }));
  },
});
```

Access states:
- Client: `useUIState()`, `useAIState()`, `useActions()`
- Server: `getAIState()`, `getMutableAIState()` (with `.update()` and `.done()` methods)

### Streaming React Components

`streamUI` function streams components from server to client. Tools return components instead of text/objects:

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      inputSchema: z.object({ location: z.string() }),
      generate: async function* ({ location }) {
        yield <LoadingComponent />;
        const weather = await getWeather(location);
        return <WeatherComponent weather={weather} location={location} />;
      },
    },
  },
});
```

### Multi-Step Interfaces

Build multi-step UIs with tool composition. Tools use async generators to yield intermediate UI then final components. Client components use `useActions`/`useUIState` for interactivity:

```tsx
// Server Action
export async function submitUserMessage(input: string) {
  'use server';
  const ui = await streamUI({
    model: openai('gpt-4o'),
    system: 'you are a flight booking assistant',
    prompt: input,
    text: async ({ content }) => <div>{content}</div>,
    tools: {
      searchFlights: {
        description: 'search for flights',
        inputSchema: z.object({
          source: z.string(),
          destination: z.string(),
          date: z.string(),
        }),
        generate: async function* ({ source, destination, date }) {
          yield `Searching for flights from ${source} to ${destination} on ${date}...`;
          const results = await searchFlights(source, destination, date);
          return <Flights flights={results} />;
        },
      },
    },
  });
  return ui.value;
}

// Client component with interactivity
'use client';
export const Flights = ({ flights }) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();
  return (
    <div>
      {flights.map(result => (
        <div key={result.id} onClick={async () => {
          const display = await submitUserMessage(`lookupFlight ${result.flightNumber}`);
          setMessages((messages) => [...messages, display]);
        }}>
          {result.flightNumber}
        </div>
      ))}
    </div>
  );
};
```

### Loading State Patterns

Three approaches:
1. **Client-side**: Manage loading state variable, disable input while streaming.
2. **Server-streamed**: Create separate streamable value for loading state, read both response and loading state on client.
3. **Streaming components**: Use `streamUI` with generator functions to yield loading component while awaiting model response.

### Error Handling

For UI errors, use `streamableUI.error()`:
```tsx
export async function getStreamedUI() {
  const ui = createStreamableUI();
  (async () => {
    ui.update(<div>loading</div>);
    const data = await fetchData();
    ui.done(<div>{data}</div>);
  })().catch(e => {
    ui.error(<div>Error: {e.message}</div>);
  });
  return ui.value;
}
```

For other errors, return error objects from server actions. Wrap streamed components with React Error Boundary on client.

### Authentication

Server Actions are public endpoints. Validate authentication tokens from cookies before executing protected logic:
```tsx
'use server';
import { cookies } from 'next/headers';
import { validateToken } from '../utils/auth';

export const getWeather = async () => {
  const token = cookies().get('token');
  if (!token || !validateToken(token)) {
    return { error: 'This action requires authentication' };
  }
  // protected logic
};
```

### Migration to AI SDK UI

AI SDK RSC is experimental with limitations: cannot abort streams, components remount on `.done()` causing flicker, many suspense boundaries crash, `createStreamableUI` causes quadratic data transfer. AI SDK UI is the recommended stable alternative.

Key differences:
- **RSC**: `streamUI` in server action combines generation and rendering
- **UI**: Separate concerns - `streamText` in route handler, `useChat` on client
- **RSC**: Tools return components directly
- **UI**: Tools return data, components render on client via tool invocations
- **RSC**: `useActions` to trigger server actions
- **UI**: `useChat` with same `id` in child components
- **RSC**: `onSetAIState` callback for persistence
- **UI**: `onFinish` callback in `streamText`
- **RSC**: `onGetUIState` callback for restoration
- **UI**: Load messages during page generation, pass as `initialMessages` to `useChat`


### advanced_patterns
Advanced patterns for prompt engineering, stream management, caching, UI rendering, routing, and deployment with language models.

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

### api_reference
Complete API reference for text generation, structured outputs, embeddings, agents, tools, MCP, UI hooks, RSC, stream adapters, and error classes with type-safe detection.

## Core Functions

**Text Generation**
- `generateText()`: Non-streaming text generation with tool calling, structured outputs, multi-step generation via callbacks. Supports messages/prompt, tools with Zod/JSON schemas, generation parameters (temperature, topP, topK, penalties, seed), output modes (text/object/array/choice/json), callbacks (onStepFinish, onFinish).
- `streamText()`: Streaming variant returning textStream, fullStream (with tool calls/results/errors), partialOutputStream for structured outputs.

**Structured Data**
- `generateObject()`: Forces models to return validated structured data with output modes: object (default), array, enum, no-schema. Supports schema (Zod/JSON), schemaName/Description, mode (auto/json/tool), system/messages, generation controls.
- `streamObject()`: Streaming structured output with partialObjectStream, elementStream (for array mode), textStream, fullStream.

**Embeddings & Reranking**
- `embed()`: Single value embedding returning vector and usage tokens.
- `embedMany()`: Multiple values with automatic request chunking.
- `rerank()`: Rerank documents by semantic relevance to query, returns ranking array with originalIndex/score/document.

**Experimental: Media & Speech**
- `generateImage()`: Image generation from text prompts with parameters: model, prompt, n (count), size (WxH), aspectRatio, seed. Returns image/images (GeneratedFile with base64/uint8Array/mediaType).
- `transcribe()`: Audio-to-text transcription returning text, segments (with timing), language code, durationInSeconds.
- `generateSpeech()`: Text-to-speech with voice/outputFormat/speed/language/instructions parameters. Returns audio (GeneratedAudioFile with base64/uint8Array/mimeType/format).

## Agents

- `Agent` interface: Contract with version/id/tools properties, generate() and stream() methods accepting prompt/messages with optional call options and abortSignal.
- `ToolLoopAgent`: Multi-step agent class with configurable stop conditions (stepCountIs, hasToolCall), structured output parsing, tool calling loop. Constructor accepts model, instructions, tools, toolChoice, stopWhen, activeTools, output, prepareStep, callbacks, generation parameters.
- `createAgentUIStream()`: Runs agent and returns async iterable of UI message chunks. Validates/converts messages, invokes agent.stream(), supports AbortSignal.
- `createAgentUIStreamResponse()`: Executes agent and streams output as HTTP Response with UI messages. Server-side only.
- `pipeAgentUIStreamToResponse()`: Pipes agent UI message stream to Node.js ServerResponse for low-latency streaming.

## Tools

- `tool()`: Helper enabling TypeScript type inference for tool definitions. Connects inputSchema to execute method. Parameters: description, inputSchema (Zod/JSON), execute (async function receiving input and ToolCallOptions), outputSchema, toModelOutput, onInputStart/Delta/Available, providerOptions, type (function/provider-defined), id, name, args.
- `dynamicTool()`: Creates tools with unknown types determined at runtime. Returns Tool<unknown, unknown> with type: 'dynamic'.

## MCP (Model Context Protocol)

- `createMCPClient()`: Lightweight MCP client factory. Methods: tools(), listResources(), readResource(), listResourceTemplates(), listPrompts(), getPrompt(), onElicitationRequest(), close(). Configuration: transport (MCPTransport/MCPTransportConfig), name, onUncaughtError, capabilities.
- `Experimental_StdioMCPTransport`: Stdio-based MCP transport for Node.js. Configuration: command (required), args, env, stderr, cwd.

## Schemas

- `jsonSchema()`: Creates JSON schema objects with optional validation function. Alternative to Zod for dynamic schemas or OpenAPI definitions.
- `zodSchema()`: Converts Zod schemas to JSON schema. Supports useReferences option for recursive schemas via z.lazy(). Critical: metadata methods (.meta(), .describe()) must be last in chain.
- `valibotSchema()`: Experimental helper converting Valibot schemas to AI SDK-compatible JSON schemas.

## Messages

- `ModelMessage`: Fundamental message structure with types: SystemModelMessage (role: system, content: string), UserModelMessage (role: user, content: string | TextPart/ImagePart/FilePart array), AssistantModelMessage (role: assistant, content: string | TextPart/ToolCallPart array), ToolModelMessage (role: tool, content: ToolResultPart array). Content parts: TextPart, ImagePart (base64/Uint8Array/Buffer/URL with optional mediaType), FilePart (data + mediaType), ToolCallPart (toolCallId/toolName/args), ToolResultPart (toolCallId/toolName/output with type: text/json/execution-denied/error-text/error-json/content).
- `UIMessage`: Type-safe message container for UI state with id, role, optional metadata, polymorphic parts (text, reasoning, tool invocations, files, sources, custom data, step markers). Generic parameters: METADATA, DATA_PARTS, TOOLS. Parts: TextUIPart, ReasoningUIPart, ToolUIPart (type: tool-{name}, states: input-streaming/input-available/output-available/output-error), SourceUrlUIPart, SourceDocumentUIPart, FileUIPart, DataUIPart (type: data-{name}), StepStartUIPart.
- `validateUIMessages()`: Async validator for UI message arrays with optional Zod schemas for metadata, data parts, tools. Throws on validation failure.
- `safeValidateUIMessages()`: Safe wrapper returning {success: boolean, data?: ValidatedMessages, error?: Error}.

## Providers

- `createProviderRegistry()`: Centralized registry for multiple providers. Access via providerId:modelId format (customizable separator). Methods: languageModel(id), embeddingModel(id), imageModel(id).
- `customProvider()`: Maps model IDs to custom LanguageModel/EmbeddingModel/ImageModel instances with optional fallback provider.

## Utilities

- `cosineSimilarity(vector1, vector2)`: Returns number [-1, 1] comparing embedding similarity.
- `wrapLanguageModel()`: Applies middleware to LanguageModelV3 instances. Parameters: model, middleware (single/array), optional modelId/providerId overrides.
- `LanguageModelV3Middleware`: Experimental middleware with transformParams, wrapGenerate, wrapStream hooks for intercepting model calls.
- `extractReasoningMiddleware()`: Extracts XML-tagged reasoning from generated text. Parameters: tagName (required), separator (default "\n"), startWithReasoning (default false).
- `simulateStreamingMiddleware()`: Converts non-streaming responses into simulated streams.
- `defaultSettingsMiddleware()`: Applies default language model settings (temperature, tokens, provider options) overridable per-call.
- `stepCountIs(count)`: Stop condition for tool loops, halts after specified step count.
- `hasToolCall(toolName)`: Stop condition triggering when named tool is invoked.
- `simulateReadableStream()`: Creates ReadableStream emitting array values with configurable initial and inter-chunk delays.
- `smoothStream()`: TransformStream for smoothing text streaming with configurable delays and chunking strategies (word/line/regex/callback). Handles non-space-delimited languages via custom regex.
- `generateId()`: Generates unique 16-char ID string.
- `createIdGenerator()`: Customizable ID generator with configurable prefix, separator, alphabet, size.

## UI Hooks & Streaming

**useChat** - Conversational UI hook with streaming, message state management, tool calling, and transport customization. Parameters: `chat` (existing instance), `transport` (ChatTransport with api endpoint, credentials, headers, body, request customization), `id` (unique identifier), `messages` (initial UIMessage[]), `onToolCall` (callback requiring `addToolOutput`), `sendAutomaticallyWhen` (resubmit condition), `onFinish`, `onError`, `onData`, `experimental_throttle`, `resume`. Returns: `id`, `messages` (UIMessage[]), `status` ('submitted'|'streaming'|'ready'|'error'), `error`, `sendMessage(message|string, options?)`, `regenerate(options?)`, `stop()`, `clearError()`, `resumeStream()`, `addToolOutput(tool, toolCallId, output|errorText)`, `setMessages(messages|function)`.

**useCompletion** - Text completion hook with streaming, state management, and UI updates. Parameters: `api` (default '/api/completion'), `id`, `initialInput`, `initialCompletion`, `onFinish((prompt, completion))`, `onError`, `headers`, `body`, `credentials`, `fetch`, `streamProtocol` ('text'|'data'), `experimental_throttle`. Returns: `completion`, `input`, `error`, `isLoading`, `setCompletion`, `setInput`, `complete(prompt, options?)`, `stop()`, `handleInputChange`, `handleSubmit`.

**useObject** (experimental) - Streams and parses JSON objects into typed objects using schemas. Parameters: `api`, `schema` (Zod or JSON Schema), `id`, `initialValue`, `fetch`, `headers`, `credentials`, `onError`, `onFinish({object, error})`. Returns: `submit(input)`, `object` (DeepPartial<RESULT>), `error`, `isLoading`, `stop()`, `clear()`.

**Message Conversion & Utilities**
- `convertToModelMessages`: Transforms useChat messages to ModelMessage objects for AI core functions. Supports multi-modal tool responses via `toModelOutput` method and custom data part conversion with `convertDataPart` callback.
- `pruneMessages`: Filters ModelMessage arrays to reduce context size. Parameters: `messages`, `reasoning` ('all'|'before-last-message'|'none'), `toolCalls` ('all'|'before-last-message'|'before-last-${number}-messages'|'none'|PruneToolCallsOption[]), `emptyMessages` ('keep'|'remove').
- `createUIMessageStream`: Creates readable stream for UI messages with message merging and error handling. Parameters: `execute({writer})` with `writer.write(UIMessageChunk)` and `writer.merge(stream)`, `onError`, `originalMessages`, `onFinish({messages, isContinuation, responseMessage})`, `generateId`. Returns: ReadableStream<UIMessageChunk>.
- `createUIMessageStreamResponse`: Creates HTTP Response streaming UI message chunks (data, text, sources, LLM output). Parameters: `stream` (ReadableStream<UIMessageChunk>), `status`, `statusText`, `headers`, `consumeSseStream`. Returns: Response object.
- `pipeUIMessageStreamToResponse`: Pipes ReadableStream<UIMessageChunk> to Node.js ServerResponse.
- `readUIMessageStream`: Transforms UIMessageChunk stream to AsyncIterableStream<UIMessage> for terminal UIs, custom clients, or RSCs. Parameters: `message` (optional starting message), `stream`, `onError`, `terminateOnError`. Returns: AsyncIterableStream<UIMessage>.

**Type Helpers**
- `InferUITools`: Maps ToolSet to inferred input/output types for each tool: `{ [NAME]: { input: InferToolInput; output: InferToolOutput } }`.
- `InferUITool`: Infers input/output types from single tool definition: `{ input: InferToolInput; output: InferToolOutput }`.

**Framework Support**: React (useChat, useCompletion, useObject), Svelte (Chat, Completion, StructuredObject), Vue.js (useChat, useCompletion).

## RSC API

**Server-Side Functions**
- `streamUI(model, system?, prompt?, messages?, tools?, ...)`: Creates streamable React UI from LLM output. Returns `{ value: ReactNode, stream: AsyncIterable<StreamPart>, response?, warnings? }`. Stream emits `{ type: 'text-delta', textDelta }`, `{ type: 'tool-call', toolCallId, toolName, args }`, `{ type: 'error', error }`, or `{ type: 'finish', finishReason, usage }`. Supports messages array (CoreSystemMessage, CoreUserMessage with TextPart/ImagePart/FilePart, CoreAssistantMessage, CoreToolMessage, UIMessage), tools with optional `generate` callback yielding React nodes, generation options (maxOutputTokens, temperature, topP, topK, presencePenalty, frequencyPenalty, stopSequences, seed), toolChoice ("auto"/"none"/"required"/`{ type, toolName }`), callbacks (text, onFinish), and standard options (maxRetries, abortSignal, headers, providerOptions).
- `createAI(actions, initialAIState, initialUIState, onGetUIState?, onSetAIState?)`: Context provider factory for client-server state management. `actions` is Record<string, Action> of server-side callables. `onSetAIState` callback receives `{ state, done }` when mutable AI state updates occur, enabling database persistence. Returns `<AI/>` provider component.
- `createStreamableUI(initialValue?)`: Creates server-to-client stream for React components. Returns object with `value: ReactNode` (returnable from Server Action), `update(ReactNode)`, `append(ReactNode)`, `done(ReactNode | null)` (required to close stream), `error(Error)`.
- `createStreamableValue(value)`: Creates server-to-client stream for serializable data. Returns streamable object with initial data and update method, returnable from Server Actions.
- `getAIState(key?)`: Reads current AI state (read-only). Optional `key` parameter accesses object property.
- `getMutableAIState(key?)`: Returns mutable AI state with `update(newState)` and `done(newState)` methods for server-side updates.

**Client-Side Hooks**
- `useAIState()`: Returns `[state]` array of globally-shared AI state under `<AI/>` provider.
- `useUIState()`: Returns `[state, setState]` array for client-side UI state (can contain functions, React nodes, data).
- `useActions()`: Returns `Record<string, Action>` of patched Server Actions.
- `useStreamableValue(streamableValue)`: Returns `[data, error, pending]` tuple. Consumes streamable values created with `createStreamableValue`.
- `readStreamableValue(stream)`: Async iterator for consuming server-streamed values. Use with `for await...of` loop.

**Example**:
```typescript
// Server (app/actions.ts)
'use server';
import { streamUI, createStreamableUI, getMutableAIState } from '@ai-sdk/rsc';

export async function generate(input: string) {
  const mutableState = getMutableAIState();
  const { value, stream } = await streamUI({
    model: openai('gpt-4'),
    prompt: input,
    tools: {
      renderComponent: {
        description: 'Render a React component',
        parameters: z.object({ content: z.string() }),
        generate: async ({ content }) => {
          const ui = createStreamableUI(<div>{content}</div>);
          mutableState.update([...mutableState.get(), { role: 'assistant', content }]);
          ui.done();
          return ui.value;
        }
      }
    }
  });
  mutableState.done(value);
  return { value, stream };
}

// Client (app/page.tsx)
import { useActions, useAIState, useUIState } from '@ai-sdk/rsc';

export default function Page() {
  const [aiState] = useAIState();
  const [uiState, setUIState] = useUIState();
  const { generate } = useActions();
  
  return (
    <button onClick={async () => {
      const result = await generate('prompt');
      setUIState([...uiState, result.value]);
    }}>
      Generate
    </button>
  );
}

// Root (app/layout.tsx)
import { createAI } from '@ai-sdk/rsc';
import { generate } from './actions';

const AI = createAI({
  actions: { generate },
  initialAIState: [],
  initialUIState: [],
  onSetAIState: ({ state, done }) => {
    if (done) saveToDatabase(state);
  }
});

export default function RootLayout({ children }) {
  return <AI>{children}</AI>;
}
```

**Status**: Experimental. Production use should migrate to AI SDK UI.

## Stream Helpers

Collection of utilities for converting and streaming responses from various AI frameworks and APIs into AI SDK-compatible data streams.

**StreamingTextResponse** (DEPRECATED in SDK 4.0, use `streamText.toDataStreamResponse()` instead)
- Wraps native Response class to return ReadableStream of text
- Auto-sets status 200 and Content-Type: 'text/plain; charset=utf-8'
- Accepts optional ResponseInit for customization and StreamData for additional response data

**AWSBedrockLlama2Stream** (DEPRECATED in SDK 4.0)
- Transforms AWS Bedrock API responses into ReadableStream using AIStream
- Supports callbacks: onStart(), onToken(token), onCompletion(completion), onFinal(completion)

**LangChain Adapter** (@ai-sdk/langchain)
- `toDataStream`: Converts LangChain StringOutputParser or AIMessageChunk streams to AIStream
- `toDataStreamResponse`: Converts to Response object with optional ResponseInit, StreamData, callbacks
- `mergeIntoDataStream`: Merges LangChain streams into existing DataStreamWriter
- Supports LangChain Expression Language, StringOutputParser, and StreamEvents v2

Example:
```typescript
import { toDataStream } from '@ai-sdk/langchain';
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({ model: 'gpt-3.5-turbo-0125' });
const stream = await model.stream(prompt);
const aiStream = toDataStream(stream);
```

**LlamaIndex Adapter** (@ai-sdk/llamaindex)
- `toDataStream`: Converts LlamaIndex ChatEngine/QueryEngine streams to data stream
- `toDataStreamResponse`: Converts to Response with optional init, data, callbacks
- `mergeIntoDataStream`: Merges into existing DataStreamWriter

Example:
```typescript
import { SimpleChatEngine } from 'llamaindex';
import { toDataStreamResponse } from '@ai-sdk/llamaindex';

const chatEngine = new SimpleChatEngine({ llm });
const stream = await chatEngine.chat({ message: prompt, stream: true });
return toDataStreamResponse(stream);
```

## Error Classes

Comprehensive set of error classes thrown by the AI SDK. All errors support type checking via `ErrorClass.isInstance(error)` method.

**API & Network Errors**
- `APICallError`: Failed API calls with `url`, `requestBodyValues`, `statusCode`, `responseHeaders`, `responseBody`, `isRetryable`, `data` properties
- `DownloadError`: Download failures with `url`, `statusCode`, `statusText`, `message`
- `EmptyResponseBodyError`: Server returned empty response body
- `LoadAPIKeyError`: API key loading failed
- `LoadSettingError`: Setting loading failed

**Data Validation Errors**
- `InvalidArgumentError`: Invalid function argument with `parameter`, `value`, `message`
- `InvalidDataContentError`: Invalid multi-modal message content with `content`, `message`
- `InvalidDataContent`: Invalid data content with `content`, `message`, `cause`
- `InvalidMessageRoleError`: Invalid message role with `role`, `message`
- `InvalidPromptError`: Invalid prompt (common cause: passing `UIMessage[]` instead of `ModelMessage[]`). Solution: use `convertToModelMessages()` to convert. Properties: `prompt`, `message`, `cause`
- `InvalidResponseDataError`: Server response with invalid data with `data`, `message`
- `InvalidToolInputError`: Tool received invalid input with `toolName`, `toolInput`, `message`, `cause`
- `TypeValidationError`: Type validation failed with `value`, `message`

**Generation Errors**
- `NoContentGeneratedError`: AI provider failed to generate content
- `NoImageGeneratedError`: Image generation failed with `message`, `responses` (metadata), `cause`
- `NoObjectGeneratedError`: `generateObject()` failed to produce schema-conforming object. Properties: `message`, `text` (raw generated), `response` (metadata), `usage`, `finishReason`, `cause`. Causes: model failed, response unparseable, or failed schema validation
- `NoSpeechGeneratedError`: Audio generation failed with `responses`, `message`
- `NoTranscriptGeneratedError`: Transcript generation failed with `responses`, `message`

**Model & Provider Errors**
- `NoSuchModelError`: Model ID not found with `modelId`, `modelType`, `message`
- `NoSuchProviderError`: Provider ID not found with `providerId`, `availableProviders`, `modelId`, `modelType`, `message`
- `NoSuchToolError`: Model called non-existent tool with `toolName`, `availableTools`, `message`
- `TooManyEmbeddingValuesForCallError`: Embedding call exceeded provider's `maxEmbeddingsPerCall` limit with `provider`, `modelId`, `maxEmbeddingsPerCall`, `values`

**Parsing & Conversion Errors**
- `JSONParseError`: JSON parsing failed with `text`, `message`
- `MessageConversionError`: Message conversion failed with `originalMessage`, `message`

**Retry & Repair Errors**
- `RetryError`: Retry operation failed after multiple attempts with `reason`, `lastError`, `errors` (array of all errors), `message`
- `ToolCallRepairError`: AI failed to repair `NoSuchToolError` or `InvalidToolInputError` with `originalError`, `message`, `cause`

**Other Errors**
- `UnsupportedFunctionalityError`: Feature not supported with `functionality`, `message`

**Usage Pattern**:
```typescript
import { APICallError, InvalidPromptError, NoObjectGeneratedError } from 'ai';

try {
  await generateObject({ model, schema, messages: convertToModelMessages(uiMessages) });
} catch (error) {
  if (APICallError.isInstance(error)) {
    console.log('API failed:', error.statusCode, error.isRetryable);
  } else if (InvalidPromptError.isInstance(error)) {
    console.log('Invalid prompt:', error.cause);
  } else if (NoObjectGeneratedError.isInstance(error)) {
    console.log('Generation failed:', error.cause, error.finishReason);
  }
}
```

### troubleshooting
Solutions for streaming, useChat, server actions, tool calling, error handling, and SDK compatibility issues

## Common Issues and Solutions

### Streaming Problems
- **Azure OpenAI slow streaming**: Change Azure content filter to "Asynchronous Filter" or use `smoothStream()` transformation to stream word-by-word
- **Streaming fails in deployed environments**: Add `Transfer-Encoding: chunked` and `Connection: keep-alive` headers to `toUIMessageStreamResponse()`
- **Streaming broken in proxied environments**: Set `Content-Encoding: none` header to disable compression
- **Streaming timeouts on Vercel**: Increase `maxDuration` (300s Hobby, 800s Pro/Enterprise) via route export or vercel.json
- **Raw protocol data in stream output (v3.0.20+)**: Use `streamText().toTextStreamResponse()` instead of `StreamingTextResponse`, or set `streamProtocol: 'text'` in `useChat`/`useCompletion`
- **Unclosed streamable UI streams**: Call `.done()` method to properly close and flush updates

### useChat/useCompletion Issues
- **"Failed to parse stream" error (v3.0.20+)**: Set `streamProtocol: 'text'` parameter for raw text streams
- **Tool calls logged but no model response**: Convert messages with `convertToModelMessages()` before `streamText()`
- **Duplicate assistant messages**: Pass `originalMessages` to `toUIMessageStreamResponse()` to reuse message IDs
- **Custom headers/body/credentials**: Use `DefaultChatTransport` for static values or pass options to `sendMessage()` for dynamic values; request-level options override hook-level
- **Stale body data**: Pass dynamic values to `sendMessage()`'s second argument instead of hook initialization
- **Status shows "streaming" before text arrives**: Check if last assistant message has content parts before showing loader
- **Type errors with onToolCall**: Check `toolCall.dynamic` to narrow `toolName` type from string to specific tool names
- **"Maximum update depth exceeded"**: Use `experimental_throttle` option (milliseconds) to throttle UI updates

### Server Actions and RSC
- **Cannot inline "use server" in Client Components**: Export from separate file, pass via props from Server Component, or use `createAI`/`useActions` hooks
- **Streamable UI component errors (.ts vs .tsx)**: Rename file to `.tsx` to enable JSX support
- **Non-serializable objects from streamText/streamObject**: Extract only serializable data; use `createStreamableValue` to wrap data for client passage
- **Client-side function calls not invoked (v3.0.20+)**: Add empty `experimental_onFunctionCall` callback to `OpenAIStream` options

### Tool Calling
- **"ToolInvocation must have a result" error**: Add `execute` function to tool definition for server-side execution, or use `useChat` with `addToolOutput` for client-side handling
- **Tool calling with structured outputs**: Use `generateText`/`streamText` with `output` option; adjust `stopWhen` step count to include structured output generation step
- **onFinish not executing on stream abort**: Add `consumeSseStream: consumeStream` to `toUIMessageStreamResponse()` config; use `isAborted` parameter in callback

### Error Handling
- **Generic "An error occurred" messages**: Use `getErrorMessage` callback with `toUIMessageStreamResponse` or `onError` with `createDataStreamResponse` to expose error details
- **streamText silent failures**: Use `onError` callback to log errors since they become part of stream rather than thrown exceptions

### Compatibility Issues
- **TypeScript performance degradation with Zod**: Upgrade Zod to 4.1.8+ or set `moduleResolution: "nodenext"` in tsconfig.json
- **AI_UnsupportedModelVersionError**: Update all `@ai-sdk/*` packages to 2.0.0+, `ai` to 5.0.0+, `zod` to 4.1.8+
- **OpenAI structured outputs reject schema**: Use `.nullable()` instead of `.nullish()` or `.optional()` in Zod schemas
- **Model type incompatibility errors**: Update provider packages and AI SDK to latest versions
- **"Cannot find namespace 'JSX'" in non-React projects**: Install `@types/react` as dependency
- **Jest "Cannot find module '@ai-sdk/rsc'"**: Add moduleNameMapper in jest.config.js mapping '@ai-sdk/rsc' to node_modules/@ai-sdk/rsc/dist
- **resume and abort features conflict**: Choose one approach; both cannot be used together in `useChat`

### Examples
```tsx
// Azure streaming fix
import { smoothStream, streamText } from 'ai';
const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});

// Deployed streaming fix
return result.toUIMessageStreamResponse({
  headers: {
    'Transfer-Encoding': 'chunked',
    Connection: 'keep-alive',
  },
});

// Proxied streaming fix
return result.toUIMessageStreamResponse({
  headers: { 'Content-Encoding': 'none' },
});

// Vercel timeout fix (Next.js)
export const maxDuration = 600;

// useChat with custom headers
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});
sendMessage({ text: input }, {
  headers: { Authorization: `Bearer ${token}` },
  body: { temperature: 0.7 },
});

// Tool with execute function
const tools = {
  weather: tool({
    description: 'Get weather',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => ({ temperature: 72 }),
  }),
};

// Error handling
const result = streamText({
  model,
  prompt,
  onError({ error }) {
    console.error(error);
  },
});

// Zod schema fix for OpenAI
schema: z.object({
  name: z.string().nullable(), // ✅ instead of .nullish()
  email: z.string().nullable(), // ✅ instead of .optional()
})
```



## Pages

### ai_sdk_6_beta
AI SDK 6 Beta introduces Agent interface with ToolLoopAgent default, tool execution approval with dynamic rules, stable structured output alongside tool calling, reranking support (Cohere/Bedrock/Together.ai), and call options for runtime agent configuration; minimal breaking changes from v5; stable release end of 2025.

## Overview
AI SDK 6 is a major version introducing the v3 Language Model Specification with new capabilities like agents and tool approval. Unlike AI SDK 5, it's not expected to have major breaking changes for most users.

## Installation
```bash
npm install ai@beta @ai-sdk/openai@beta @ai-sdk/react@beta
```

## Agent Abstraction

New unified `Agent` interface for building agents with full control over execution flow, tool loops, and state management.

### ToolLoopAgent (Default Implementation)
```typescript
import { openai } from '@ai-sdk/openai';
import { ToolLoopAgent } from 'ai';
import { weatherTool } from '@/tool/weather';

const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful weather assistant.',
  tools: { weather: weatherTool },
});

const result = await weatherAgent.generate({
  prompt: 'What is the weather in San Francisco?',
});
```

Automatically handles: calls LLM → executes tool calls → adds results back → repeats until complete (default `stopWhen: stepCountIs(20)`).

### Call Options
Type-safe runtime configuration for dynamic agent behavior:
```typescript
const supportAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  callOptionsSchema: z.object({
    userId: z.string(),
    accountType: z.enum(['free', 'pro', 'enterprise']),
  }),
  instructions: 'You are a helpful customer support agent.',
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + `\nUser context:\n- Account type: ${options.accountType}\n- User ID: ${options.userId}`,
  }),
});

const result = await supportAgent.generate({
  prompt: 'How do I upgrade my account?',
  options: { userId: 'user_123', accountType: 'free' },
});
```

Use cases: RAG (inject documents), dynamic model selection, tool configuration, provider options.

### UI Integration
```typescript
// Server
import { createAgentUIStreamResponse } from 'ai';
export async function POST(request: Request) {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({ agent: weatherAgent, messages });
}

// Client
import { useChat } from '@ai-sdk/react';
import { InferAgentUIMessage } from 'ai';
type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;
const { messages, sendMessage } = useChat<WeatherAgentUIMessage>();
```

### Custom Agent Implementations
`Agent` is an interface, not a concrete class. Implement it for custom architectures:
```typescript
class Orchestrator implements Agent {
  constructor(private subAgents: Record<string, Agent>) {}
}
```

## Tool Execution Approval

Control when tools are executed with `needsApproval`:
```typescript
const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({ city: z.string() }),
  needsApproval: true,
  execute: async ({ city }) => fetchWeather(city),
});
```

### Dynamic Approval
```typescript
const paymentTool = tool({
  description: 'Process a payment',
  inputSchema: z.object({ amount: z.number(), recipient: z.string() }),
  needsApproval: async ({ amount }) => amount > 1000,
  execute: async ({ amount, recipient }) => processPayment(amount, recipient),
});
```

### Client-Side Approval UI
```tsx
export function WeatherToolView({ invocation, addToolApprovalResponse }) {
  if (invocation.state === 'approval-requested') {
    return (
      <div>
        <p>Can I retrieve the weather for {invocation.input.city}?</p>
        <button onClick={() => addToolApprovalResponse({ id: invocation.approval.id, approved: true })}>Approve</button>
        <button onClick={() => addToolApprovalResponse({ id: invocation.approval.id, approved: false })}>Deny</button>
      </div>
    );
  }
  if (invocation.state === 'output-available') {
    return <div>Weather: {invocation.output.weather}, Temperature: {invocation.output.temperature}°F</div>;
  }
}
```

### Auto-Submit After Approvals
```typescript
const { messages, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});
```

## Structured Output (Stable)

Generate structured data alongside multi-step tool calling using the `output` parameter:
```typescript
import { Output, ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temperature: 72, condition: 'sunny' }),
    }),
  },
  output: Output.object({
    schema: z.object({
      summary: z.string(),
      temperature: z.number(),
      recommendation: z.string(),
    }),
  }),
});

const { output } = await agent.generate({
  prompt: 'What is the weather in San Francisco and what should I wear?',
});
// { summary: "It's sunny in San Francisco", temperature: 72, recommendation: "Wear light clothing and sunglasses" }
```

### Output Types
- `Output.object()`: Zod schemas
- `Output.array()`: Arrays of structured objects
- `Output.choice()`: Select from specific options
- `Output.text()`: Plain text (default)

### Streaming Structured Output
```typescript
const profileAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'Generate realistic person profiles.',
  output: Output.object({
    schema: z.object({ name: z.string(), age: z.number(), occupation: z.string() }),
  }),
});

const { partialOutputStream } = await profileAgent.stream({
  prompt: 'Generate a person profile.',
});

for await (const partial of partialOutputStream) {
  console.log(partial);
  // { name: "John" }
  // { name: "John", age: 30 }
  // { name: "John", age: 30, occupation: "Engineer" }
}
```

Structured outputs also supported in `generateText` and `streamText`. When using these, configure multiple steps with `stopWhen` (e.g., `stopWhen: stepCountIs(2)` for tool calling + output generation).

## Reranking Support

Improve search relevance by reordering documents based on query relationship using specialized reranking models:
```typescript
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const documents = ['sunny day at the beach', 'rainy afternoon in the city', 'snowy night in the mountains'];
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'talk about rain',
  topN: 2,
});
// [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day at the beach' }
// ]
```

### Structured Document Reranking
```typescript
const documents = [
  { from: 'Paul Doe', subject: 'Follow-up', text: 'We are happy to give you a discount of 20%...' },
  { from: 'John McGill', subject: 'Missing Info', text: 'Sorry, but here is the pricing information from Oracle: $5000/month' },
];

const { rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});
// { from: 'John McGill', subject: 'Missing Info', text: '...' }
```

Supported providers: Cohere, Amazon Bedrock, Together.ai.

## Image Editing Support
Coming soon: image-to-image transformations and multi-modal editing with text prompts.

## Migration from AI SDK 5.x
Minimal breaking changes expected. Version bump is due to v3 Language Model Specification, but most AI SDK 5 code will work with little or no modification.

## Timeline
- AI SDK 6 Beta: Available now
- Stable Release: End of 2025

