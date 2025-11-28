## ToolLoopAgent Class

The ToolLoopAgent class encapsulates LLM configuration, tools, and behavior into reusable components. It handles the agent loop automatically, allowing the LLM to call tools multiple times in sequence to accomplish complex tasks.

### Creating an Agent

```ts
import { ToolLoopAgent } from 'ai';

const myAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: {
    // Your tools here
  },
});
```

### Configuration Options

**Model and System Instructions:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are an expert software engineer.',
});
```

**Tools:**
```ts
import { ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';

const codeAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    runCode: tool({
      description: 'Execute Python code',
      inputSchema: z.object({
        code: z.string(),
      }),
      execute: async ({ code }) => {
        return { output: 'Code executed successfully' };
      },
    }),
  },
});
```

**Loop Control:**
By default, agents run for 20 steps. Each step represents one generation (either text or a tool call). The loop continues until a finish reason other than tool-calls is returned, a tool without an execute function is invoked, a tool call needs approval, or a stop condition is met.

```ts
import { ToolLoopAgent, stepCountIs } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  stopWhen: stepCountIs(20), // Allow up to 20 steps
});
```

Combine multiple conditions:
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  stopWhen: [
    stepCountIs(20),
    yourCustomCondition(),
  ],
});
```

**Tool Choice:**
Control how the agent uses tools with `toolChoice: 'required'` (force tool use), `'none'` (disable tools), or `'auto'` (default, let model decide). Force a specific tool:

```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: weatherTool,
    cityAttractions: attractionsTool,
  },
  toolChoice: {
    type: 'tool',
    toolName: 'weather',
  },
});
```

**Structured Output:**
```ts
import { ToolLoopAgent, Output, stepCountIs } from 'ai';
import { z } from 'zod';

const analysisAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  output: Output.object({
    schema: z.object({
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      summary: z.string(),
      keyPoints: z.array(z.string()),
    }),
  }),
  stopWhen: stepCountIs(10),
});

const { output } = await analysisAgent.generate({
  prompt: 'Analyze customer feedback from the last quarter',
});
```

### System Instructions

System instructions define agent behavior, personality, and constraints. Examples:

**Basic role definition:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are an expert data analyst. You provide clear insights from complex data.',
});
```

**Detailed behavioral guidelines:**
```ts
const codeReviewAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a senior software engineer conducting code reviews.

  Your approach:
  - Focus on security vulnerabilities first
  - Identify performance bottlenecks
  - Suggest improvements for readability and maintainability
  - Be constructive and educational in your feedback
  - Always explain why something is an issue and how to fix it`,
});
```

**Constrain behavior:**
```ts
const customerSupportAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a customer support specialist for an e-commerce platform.

  Rules:
  - Never make promises about refunds without checking the policy
  - Always be empathetic and professional
  - If you don't know something, say so and offer to escalate
  - Keep responses concise and actionable
  - Never share internal company information`,
  tools: {
    checkOrderStatus,
    lookupPolicy,
    createTicket,
  },
});
```

**Tool usage guidance:**
```ts
const researchAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a research assistant with access to search and document tools.

  When researching:
  1. Always start with a broad search to understand the topic
  2. Use document analysis for detailed information
  3. Cross-reference multiple sources before drawing conclusions
  4. Cite your sources when presenting information
  5. If information conflicts, present both viewpoints`,
  tools: {
    webSearch,
    analyzeDocument,
    extractQuotes,
  },
});
```

**Format and style:**
```ts
const technicalWriterAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a technical documentation writer.

  Writing style:
  - Use clear, simple language
  - Avoid jargon unless necessary
  - Structure information with headers and bullet points
  - Include code examples where relevant
  - Write in second person ("you" instead of "the user")

  Always format responses in Markdown.`,
});
```

### Using an Agent

**Generate text (one-time):**
```ts
const result = await myAgent.generate({
  prompt: 'What is the weather like?',
});
console.log(result.text);
```

**Stream text:**
```ts
const stream = myAgent.stream({
  prompt: 'Tell me a story',
});

for await (const chunk of stream.textStream) {
  console.log(chunk);
}
```

**Create API response for client applications:**
```ts
import { createAgentUIStreamResponse } from 'ai';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: myAgent,
    messages,
  });
}
```

### Type Safety

Infer types for agent UIMessages:
```ts
import { ToolLoopAgent, InferAgentUIMessage } from 'ai';

const myAgent = new ToolLoopAgent({
  // ... configuration
});

export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```

Use in client components:
```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import type { MyAgentUIMessage } from '@/agent/my-agent';

export function Chat() {
  const { messages } = useChat<MyAgentUIMessage>();
  // Full type safety for your messages and tools
}
```