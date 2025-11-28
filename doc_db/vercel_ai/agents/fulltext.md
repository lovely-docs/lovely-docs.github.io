

## Pages

### agents_overview
LLM agents use tools in loops via ToolLoopAgent class; define tools with descriptions, input schemas, and execute functions; agent automatically chains tool calls and generates responses; use for flexible task automation, core functions for deterministic workflows.

## Agents

Agents are LLMs that use tools in a loop to accomplish tasks. Three core components work together:

- **LLMs** process input and decide the next action
- **Tools** extend capabilities beyond text generation (reading files, calling APIs, writing to databases)
- **Loop** orchestrates execution through context management (maintaining conversation history and deciding what the model sees at each step) and stopping conditions (determining when the task is complete)

### ToolLoopAgent Class

The ToolLoopAgent class handles these three components. Example:

```ts
import { ToolLoopAgent, stepCountIs, tool } from 'ai';
import { z } from 'zod';

const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location (in Fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert temperature from Fahrenheit to Celsius',
      inputSchema: z.object({
        temperature: z.number().describe('Temperature in Fahrenheit'),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        return { celsius };
      },
    }),
  },
  stopWhen: stepCountIs(20),
});

const result = await weatherAgent.generate({
  prompt: 'What is the weather in San Francisco in celsius?',
});

console.log(result.text); // agent's final answer
console.log(result.steps); // steps taken by the agent
```

The agent automatically calls tools in sequence, manages the loop, and generates a final response. The Agent class handles loop orchestration, context management, and stopping conditions.

### Why Use the Agent Class

- **Reduces boilerplate** - Manages loops and message arrays
- **Improves reusability** - Define once, use throughout your application
- **Simplifies maintenance** - Single place to update agent configuration

For most use cases, start with the Agent class. Use core functions (`generateText`, `streamText`) when you need explicit control over each step for complex structured workflows.

### Structured Workflows

Agents are flexible but non-deterministic. For reliable, repeatable outcomes with explicit control flow, use core functions with structured workflow patterns combining conditional statements, standard functions, error handling, and explicit control flow. See workflow patterns documentation for more details.

### building_agents
ToolLoopAgent class encapsulates model, tools, and instructions; supports loop control (default 20 steps), tool choice modes, structured output, system instructions for behavior definition, and three usage patterns (generate, stream, createAgentUIStreamResponse) with full TypeScript type inference.

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

### workflow_patterns
Five agent workflow patterns: sequential processing (chained steps), routing (context-based path selection), parallel processing (concurrent independent tasks), orchestrator-worker (coordinator with specialized agents), evaluator-optimizer (feedback loops with quality thresholds and retries).

## Workflow Patterns for Agents

Combine building blocks to add structure and reliability to agents. Five main patterns:

**Sequential Processing (Chains)** - Steps execute in order, each step's output becomes the next step's input. Example: Generate marketing copy, evaluate quality metrics, regenerate if quality thresholds not met (call-to-action present, emotional appeal ≥7, clarity ≥7).

**Routing** - Model decides which path to take based on context and intermediate results. Example: Classify customer query (type: general/refund/technical, complexity: simple/complex), then route to appropriate model size and system prompt based on classification.

**Parallel Processing** - Independent subtasks execute simultaneously. Example: Run three specialized code reviews in parallel (security, performance, maintainability), each with different system prompts and schemas, then aggregate results.

**Orchestrator-Worker** - Primary model coordinates specialized workers. Each worker optimizes for specific subtasks while orchestrator maintains context. Example: Orchestrator plans feature implementation (files to create/modify/delete), then workers execute each change with specialized system prompts appropriate to the change type.

**Evaluator-Optimizer** - Dedicated evaluation steps assess intermediate results and trigger retries or corrective action. Example: Translate text, evaluate translation (quality score, tone/nuance/cultural accuracy), if below threshold regenerate with feedback, repeat up to 3 iterations.

## Design Considerations

Choose approach based on:
- **Flexibility vs Control** - How much freedom does LLM need vs how tightly constrain actions
- **Error Tolerance** - Consequences of mistakes in use case
- **Cost** - More complex systems mean more LLM calls
- **Maintenance** - Simpler architectures easier to debug

Start with simplest approach meeting needs. Add complexity by: breaking tasks into clear steps, adding tools for capabilities, implementing feedback loops, introducing multiple agents.

### loop_control
Control agent loop execution with stopWhen conditions and prepareStep callbacks to modify model, tools, messages, and context between steps; or implement manual loops with generateText/streamText for complete control.

## Stop Conditions

Control agent loop execution with the `stopWhen` parameter. By default, agents stop after 20 steps using `stepCountIs(20)`.

Built-in conditions:
- `stepCountIs(n)` - Stop after n steps
- `hasToolCall('toolName')` - Stop after calling a specific tool

Combine multiple conditions in an array; execution stops when any condition is met:

```ts
stopWhen: [
  stepCountIs(20),
  hasToolCall('someTool'),
]
```

Create custom conditions by implementing `StopCondition<typeof tools>` that receives `{ steps }` and returns a boolean:

```ts
const hasAnswer: StopCondition<typeof tools> = ({ steps }) => {
  return steps.some(step => step.text?.includes('ANSWER:')) ?? false;
};

const budgetExceeded: StopCondition<typeof tools> = ({ steps }) => {
  const totalUsage = steps.reduce(
    (acc, step) => ({
      inputTokens: acc.inputTokens + (step.usage?.inputTokens ?? 0),
      outputTokens: acc.outputTokens + (step.usage?.outputTokens ?? 0),
    }),
    { inputTokens: 0, outputTokens: 0 },
  );
  const costEstimate = (totalUsage.inputTokens * 0.01 + totalUsage.outputTokens * 0.03) / 1000;
  return costEstimate > 0.5;
};
```

## Prepare Step

The `prepareStep` callback runs before each step and receives `{ model, stepNumber, steps, messages }`. Return an object with any settings to override (or empty object for no changes).

Dynamic model selection based on step requirements:

```ts
prepareStep: async ({ stepNumber, messages }) => {
  if (stepNumber > 2 && messages.length > 10) {
    return { model: 'anthropic/claude-sonnet-4.5' };
  }
  return {};
}
```

Context management - keep only recent messages:

```ts
prepareStep: async ({ messages }) => {
  if (messages.length > 20) {
    return {
      messages: [messages[0], ...messages.slice(-10)],
    };
  }
  return {};
}
```

Tool selection - control available tools per phase:

```ts
prepareStep: async ({ stepNumber }) => {
  if (stepNumber <= 2) {
    return { activeTools: ['search'], toolChoice: 'required' };
  }
  if (stepNumber <= 5) {
    return { activeTools: ['analyze'] };
  }
  return { activeTools: ['summarize'], toolChoice: 'required' };
}
```

Force specific tool usage:

```ts
prepareStep: async ({ stepNumber }) => {
  if (stepNumber === 0) {
    return { toolChoice: { type: 'tool', toolName: 'search' } };
  }
  if (stepNumber === 5) {
    return { toolChoice: { type: 'tool', toolName: 'summarize' } };
  }
  return {};
}
```

Message modification - transform messages before sending to model:

```ts
prepareStep: async ({ messages }) => {
  const processedMessages = messages.map(msg => {
    if (msg.role === 'tool' && msg.content.length > 1000) {
      return { ...msg, content: summarizeToolResult(msg.content) };
    }
    return msg;
  });
  return { messages: processedMessages };
}
```

## Manual Loop Control

For complete control, use `generateText` or `streamText` from AI SDK Core to implement custom loop management:

```ts
import { generateText, ModelMessage } from 'ai';

const messages: ModelMessage[] = [{ role: 'user', content: '...' }];
let step = 0;
const maxSteps = 10;

while (step < maxSteps) {
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
    tools: { /* your tools */ },
  });

  messages.push(...result.response.messages);
  if (result.text) break;
  step++;
}
```

This provides complete control over message history, step-by-step decisions, stopping conditions, dynamic tool/model selection, and error handling.

### configuring_call_options
Type-safe runtime agent configuration via callOptionsSchema and prepareCall: dynamically inject context, select models, configure tools, set provider options, fetch RAG data, combine modifications.

Call options enable type-safe runtime configuration of agent behavior through structured inputs. Define them in three steps: specify inputs with `callOptionsSchema` using Zod, configure agent settings in `prepareCall` function, and pass options when calling `generate()` or `stream()`.

**Dynamic Context Injection**: Add user data to prompts at runtime. Define schema with user properties, modify instructions in `prepareCall` to include context, pass options when generating.

**Dynamic Model Selection**: Choose models based on request characteristics. Use `prepareCall` to return different model based on complexity option - e.g., use gpt-4o-mini for simple queries, o1-mini for complex reasoning.

**Dynamic Tool Configuration**: Adjust tool behavior per request. Configure tools in `prepareCall` with runtime values like user location for search tools or context size adjustments.

**Provider-Specific Options**: Set provider settings dynamically like OpenAI's reasoningEffort based on task difficulty via `providerOptions` in `prepareCall`.

**Retrieval Augmented Generation (RAG)**: `prepareCall` can be async - fetch relevant documents via vector search and inject into instructions before agent execution.

**Combining Multiple Modifications**: Modify model, tools, and instructions together in single `prepareCall` - e.g., upgrade model for urgent requests, limit tools by user role, adjust instructions based on context.

**API Integration**: Pass call options through `createAgentUIStreamResponse` in API routes by including them in the options parameter alongside agent and messages.

The `options` parameter becomes required and type-checked when `callOptionsSchema` is defined. TypeScript enforces correct types at call sites.

