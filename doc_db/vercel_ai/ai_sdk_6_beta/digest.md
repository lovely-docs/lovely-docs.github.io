## AI SDK 6 Beta Overview

AI SDK 6 is a major version bump due to the v3 Language Model Specification, but is not expected to have major breaking changes for most users. Migration from AI SDK 5 should be straightforward with minimal code changes.

Install with: `npm install ai@beta @ai-sdk/openai@beta @ai-sdk/react@beta`

### Agent Abstraction

New unified `Agent` interface for building agents with full control over execution flow, tool loops, and state management.

**ToolLoopAgent** - Default implementation that automatically handles the tool execution loop:
1. Calls the LLM with your prompt
2. Executes any requested tool calls
3. Adds results back to the conversation
4. Repeats until complete (default `stopWhen: stepCountIs(20)`)

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

**Call Options** - Type-safe runtime configuration using Zod schemas to dynamically configure agents:

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

Use cases: RAG (inject retrieved documents), dynamic model selection, tool configuration per request, provider options.

**UI Integration** - Server-side and client-side integration with React:

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

**Custom Agent Implementations** - `Agent` is an interface, not a concrete class. Implement it to build custom architectures like multi-agent orchestrators:

```typescript
import { Agent } from 'ai';
class Orchestrator implements Agent {
  constructor(private subAgents: Record<string, Agent>) {}
}
```

### Tool Execution Approval

Tool approval system for human-in-the-loop patterns. Enable approval by setting `needsApproval`:

```typescript
import { tool } from 'ai';
import { z } from 'zod';

const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({ city: z.string() }),
  needsApproval: true,
  execute: async ({ city }) => fetchWeather(city),
});
```

**Dynamic Approval** - Make approval decisions based on tool input:

```typescript
const paymentTool = tool({
  description: 'Process a payment',
  inputSchema: z.object({ amount: z.number(), recipient: z.string() }),
  needsApproval: async ({ amount }) => amount > 1000,
  execute: async ({ amount, recipient }) => processPayment(amount, recipient),
});
```

**Client-Side Approval UI** - Handle approval requests in React:

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

**Auto-Submit After Approvals** - Automatically continue conversation:

```typescript
import { useChat } from '@ai-sdk/react';
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';
const { messages, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});
```

### Structured Output (Stable)

Generate structured data alongside multi-step tool calling. Previously only available with `generateObject`/`streamObject` (no tool calling). Now `ToolLoopAgent`, `generateText`, and `streamText` support structured output via the `output` parameter:

```typescript
import { Output, ToolLoopAgent, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
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

**Output Types** - `Output` object provides multiple strategies:
- `Output.object()` - Generate structured objects with Zod schemas
- `Output.array()` - Generate arrays of structured objects
- `Output.choice()` - Select from specific set of options
- `Output.text()` - Generate plain text (default)

**Streaming Structured Output** - Use `agent.stream()` to stream structured output as generated:

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

When using structured output with `generateText` or `streamText`, configure multiple steps with `stopWhen` because generating the structured output is itself a step (e.g., `stopWhen: stepCountIs(2)`).

### Reranking Support

Native reranking support to improve search relevance by reordering documents based on query-document relationships. Reranking models are specifically trained for this, producing more accurate relevance scores than embedding-based similarity search:

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

console.log(ranking);
// [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day at the beach' }
// ]
```

**Structured Document Reranking** - Reranking supports structured documents for searching databases, emails, etc.:

```typescript
const documents = [
  { from: 'Paul Doe', subject: 'Follow-up', text: 'We are happy to give you a discount of 20% on your next order.' },
  { from: 'John McGill', subject: 'Missing Info', text: 'Sorry, but here is the pricing information from Oracle: $5000/month' },
];

const { rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});

console.log(rerankedDocuments[0]);
// { from: 'John McGill', subject: 'Missing Info', text: '...' }
```

**Supported Providers** - Cohere, Amazon Bedrock, Together.ai

### Image Editing Support

Native support for image editing and generation workflows coming soon, enabling image-to-image transformations and multi-modal editing with text prompts.

### Migration from AI SDK 5.x

AI SDK 6 is expected to have minimal breaking changes. Most AI SDK 5 code will work with little or no modification.

**Timeline**: Beta available now, stable release end of 2025.