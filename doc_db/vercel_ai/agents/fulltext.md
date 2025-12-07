

## Pages

### agents-overview
ToolLoopAgent class orchestrates LLMs with tools in a loop; define tools with description/inputSchema/execute, call generate() with prompt, agent handles context and stopping conditions automatically.

## Agents

Agents are LLMs that use tools in a loop to accomplish tasks. Three components work together:
- **LLMs** process input and decide the next action
- **Tools** extend capabilities (reading files, calling APIs, writing to databases)
- **Loop** orchestrates execution through context management and stopping conditions

### ToolLoopAgent Class

The ToolLoopAgent class handles these three components:

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

The agent automatically calls tools in sequence and generates a final response. The Agent class handles the loop, context management, and stopping conditions.

### Why Use the Agent Class

- **Reduces boilerplate** - Manages loops and message arrays
- **Improves reusability** - Define once, use throughout your application
- **Simplifies maintenance** - Single place to update agent configuration

For most use cases, start with the Agent class. Use core functions (`generateText`, `streamText`) when you need explicit control over each step for complex structured workflows.

### Structured Workflows

Agents are non-deterministic. For reliable, repeatable outcomes with explicit control flow, use core functions with structured workflow patterns combining conditional statements, standard functions, error handling, and explicit control flow.

### building_agents
ToolLoopAgent class for encapsulating LLM config, tools, and behavior with automatic multi-step tool calling; configure model, instructions, tools, loop control (stopWhen), toolChoice, structured output; use via generate/stream/createAgentUIStreamResponse; supports TypeScript type inference for UI messages.

## ToolLoopAgent Class

The ToolLoopAgent class encapsulates LLM configuration, tools, and behavior into reusable components. It handles the agent loop automatically, allowing the LLM to call tools multiple times in sequence.

Benefits:
- Reuse configurations across your application
- Maintain consistent behavior and capabilities
- Reduce boilerplate in API routes
- Full TypeScript support

## Creating an Agent

```ts
import { ToolLoopAgent } from 'ai';

const myAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { /* your tools */ },
});
```

## Configuration Options

**Model and System Instructions:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are an expert software engineer.',
});
```

**Tools:**
```ts
import { tool } from 'ai';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    runCode: tool({
      description: 'Execute Python code',
      inputSchema: z.object({ code: z.string() }),
      execute: async ({ code }) => ({ output: 'Code executed successfully' }),
    }),
  },
});
```

**Loop Control:**
By default, agents run for 20 steps. Each step is one generation (text or tool call). The loop continues until a finish reason other than tool-calls is returned, a tool without execute function is called, a tool needs approval, or a stop condition is met.

```ts
import { stepCountIs } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  stopWhen: stepCountIs(20), // Allow up to 20 steps
  // or combine conditions:
  stopWhen: [stepCountIs(20), yourCustomCondition()],
});
```

**Tool Choice:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: weatherTool, cityAttractions: attractionsTool },
  toolChoice: 'required', // 'auto' (default), 'none', or specific tool
  // or force specific tool:
  toolChoice: { type: 'tool', toolName: 'weather' },
});
```

**Structured Output:**
```ts
import { Output } from 'ai';

const agent = new ToolLoopAgent({
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

const { output } = await agent.generate({
  prompt: 'Analyze customer feedback from the last quarter',
});
```

## System Instructions

System instructions define agent behavior, personality, and constraints. Examples:

**Basic role:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are an expert data analyst. You provide clear insights from complex data.',
});
```

**Detailed behavioral guidelines:**
```ts
const agent = new ToolLoopAgent({
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

**Constrained behavior:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a customer support specialist for an e-commerce platform.
  Rules:
  - Never make promises about refunds without checking the policy
  - Always be empathetic and professional
  - If you don't know something, say so and offer to escalate
  - Keep responses concise and actionable
  - Never share internal company information`,
  tools: { checkOrderStatus, lookupPolicy, createTicket },
});
```

**Tool usage guidance:**
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: `You are a research assistant with access to search and document tools.
  When researching:
  1. Always start with a broad search to understand the topic
  2. Use document analysis for detailed information
  3. Cross-reference multiple sources before drawing conclusions
  4. Cite your sources when presenting information
  5. If information conflicts, present both viewpoints`,
  tools: { webSearch, analyzeDocument, extractQuotes },
});
```

**Format and style:**
```ts
const agent = new ToolLoopAgent({
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

## Using an Agent

**Generate text (one-time):**
```ts
const result = await myAgent.generate({ prompt: 'What is the weather like?' });
console.log(result.text);
```

**Stream text:**
```ts
const stream = myAgent.stream({ prompt: 'Tell me a story' });
for await (const chunk of stream.textStream) {
  console.log(chunk);
}
```

**API response for UI:**
```ts
import { createAgentUIStreamResponse } from 'ai';

export async function POST(request: Request) {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({ agent: myAgent, messages });
}
```

## Type Safety

Infer types for agent UIMessages:
```ts
import { InferAgentUIMessage } from 'ai';

const myAgent = new ToolLoopAgent({ /* ... */ });
export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```

Use in client components:
```tsx
import { useChat } from '@ai-sdk/react';
import type { MyAgentUIMessage } from '@/agent/my-agent';

export function Chat() {
  const { messages } = useChat<MyAgentUIMessage>();
  // Full type safety for messages and tools
}
```

### workflow-patterns
Five agent workflow patterns: sequential (chained steps), routing (context-based path selection), parallel (concurrent independent tasks), orchestrator-worker (coordinator + specialists), evaluator-optimizer (feedback loops with quality gates).

## Workflow Patterns for Agents

Five core patterns for building reliable agent workflows:

### Sequential Processing (Chains)
Steps execute in order, each step's output feeds into the next. Use for well-defined sequences like content generation pipelines.

```ts
async function generateMarketingCopy(input: string) {
  const model = 'openai/gpt-4o';
  
  // Step 1: Generate copy
  const { text: copy } = await generateText({
    model,
    prompt: `Write persuasive marketing copy for: ${input}...`,
  });

  // Step 2: Quality check
  const { object: qualityMetrics } = await generateObject({
    model,
    schema: z.object({
      hasCallToAction: z.boolean(),
      emotionalAppeal: z.number().min(1).max(10),
      clarity: z.number().min(1).max(10),
    }),
    prompt: `Evaluate this marketing copy: ${copy}`,
  });

  // Step 3: Conditional regeneration
  if (!qualityMetrics.hasCallToAction || qualityMetrics.emotionalAppeal < 7 || qualityMetrics.clarity < 7) {
    const { text: improvedCopy } = await generateText({
      model,
      prompt: `Rewrite with improvements...`,
    });
    return { copy: improvedCopy, qualityMetrics };
  }
  return { copy, qualityMetrics };
}
```

### Routing
Model decides which path to take based on context. First LLM call's results determine subsequent call's model size and system prompt.

```ts
async function handleCustomerQuery(query: string) {
  // Classify query
  const { object: classification } = await generateObject({
    model: 'openai/gpt-4o',
    schema: z.object({
      type: z.enum(['general', 'refund', 'technical']),
      complexity: z.enum(['simple', 'complex']),
    }),
    prompt: `Classify this customer query: ${query}`,
  });

  // Route based on classification
  const { text: response } = await generateText({
    model: classification.complexity === 'simple' ? 'openai/gpt-4o-mini' : 'openai/o4-mini',
    system: {
      general: 'You are an expert customer service agent...',
      refund: 'You are a customer service agent specializing in refunds...',
      technical: 'You are a technical support specialist...',
    }[classification.type],
    prompt: query,
  });

  return { response, classification };
}
```

### Parallel Processing
Independent subtasks execute simultaneously. Example: parallel code review with specialized reviewers.

```ts
async function parallelCodeReview(code: string) {
  const [securityReview, performanceReview, maintainabilityReview] = await Promise.all([
    generateObject({
      model: 'openai/gpt-4o',
      system: 'You are an expert in code security...',
      schema: z.object({
        vulnerabilities: z.array(z.string()),
        riskLevel: z.enum(['low', 'medium', 'high']),
        suggestions: z.array(z.string()),
      }),
      prompt: `Review this code: ${code}`,
    }),
    generateObject({
      model: 'openai/gpt-4o',
      system: 'You are an expert in code performance...',
      schema: z.object({
        issues: z.array(z.string()),
        impact: z.enum(['low', 'medium', 'high']),
        optimizations: z.array(z.string()),
      }),
      prompt: `Review this code: ${code}`,
    }),
    generateObject({
      model: 'openai/gpt-4o',
      system: 'You are an expert in code quality...',
      schema: z.object({
        concerns: z.array(z.string()),
        qualityScore: z.number().min(1).max(10),
        recommendations: z.array(z.string()),
      }),
      prompt: `Review this code: ${code}`,
    }),
  ]);

  const { text: summary } = await generateText({
    model: 'openai/gpt-4o',
    system: 'You are a technical lead summarizing code reviews.',
    prompt: `Synthesize these results: ${JSON.stringify([...], null, 2)}`,
  });

  return { reviews: [...], summary };
}
```

### Orchestrator-Worker
Primary model (orchestrator) coordinates specialized workers. Each worker optimizes for a specific subtask while orchestrator maintains overall context.

```ts
async function implementFeature(featureRequest: string) {
  // Orchestrator: Plan
  const { object: implementationPlan } = await generateObject({
    model: 'openai/o4-mini',
    schema: z.object({
      files: z.array(z.object({
        purpose: z.string(),
        filePath: z.string(),
        changeType: z.enum(['create', 'modify', 'delete']),
      })),
      estimatedComplexity: z.enum(['low', 'medium', 'high']),
    }),
    system: 'You are a senior software architect...',
    prompt: `Analyze this feature request: ${featureRequest}`,
  });

  // Workers: Execute
  const fileChanges = await Promise.all(
    implementationPlan.files.map(async file => {
      const { object: change } = await generateObject({
        model: 'anthropic/claude-sonnet-4.5',
        schema: z.object({
          explanation: z.string(),
          code: z.string(),
        }),
        system: {
          create: 'You are an expert at implementing new files...',
          modify: 'You are an expert at modifying existing code...',
          delete: 'You are an expert at safely removing code...',
        }[file.changeType],
        prompt: `Implement changes for ${file.filePath}...`,
      });
      return { file, implementation: change };
    }),
  );

  return { plan: implementationPlan, changes: fileChanges };
}
```

### Evaluator-Optimizer
Dedicated evaluation steps assess intermediate results. Based on evaluation, workflow proceeds, retries with adjusted parameters, or takes corrective action.

```ts
async function translateWithFeedback(text: string, targetLanguage: string) {
  let currentTranslation = '';
  let iterations = 0;
  const MAX_ITERATIONS = 3;

  const { text: translation } = await generateText({
    model: 'openai/gpt-4o-mini',
    system: 'You are an expert literary translator.',
    prompt: `Translate to ${targetLanguage}: ${text}`,
  });
  currentTranslation = translation;

  while (iterations < MAX_ITERATIONS) {
    const { object: evaluation } = await generateObject({
      model: 'anthropic/claude-sonnet-4.5',
      schema: z.object({
        qualityScore: z.number().min(1).max(10),
        preservesTone: z.boolean(),
        preservesNuance: z.boolean(),
        culturallyAccurate: z.boolean(),
        specificIssues: z.array(z.string()),
        improvementSuggestions: z.array(z.string()),
      }),
      system: 'You are an expert in evaluating literary translations.',
      prompt: `Evaluate this translation: Original: ${text}, Translation: ${currentTranslation}`,
    });

    if (evaluation.qualityScore >= 8 && evaluation.preservesTone && evaluation.preservesNuance && evaluation.culturallyAccurate) {
      break;
    }

    const { text: improvedTranslation } = await generateText({
      model: 'anthropic/claude-sonnet-4.5',
      system: 'You are an expert literary translator.',
      prompt: `Improve based on feedback: ${evaluation.specificIssues.join('\n')}...`,
    });

    currentTranslation = improvedTranslation;
    iterations++;
  }

  return { finalTranslation: currentTranslation, iterationsRequired: iterations };
}
```

## Design Considerations

Choose approach based on:
- **Flexibility vs Control**: How much freedom does the LLM need vs how tightly you must constrain actions?
- **Error Tolerance**: What are consequences of mistakes?
- **Cost**: More complex systems mean more LLM calls
- **Maintenance**: Simpler architectures are easier to debug

Start with simplest approach that meets needs. Add complexity by breaking tasks into clear steps, adding tools for specific capabilities, implementing feedback loops, and introducing multiple agents.

### loop_control
Control agent loop execution with stopWhen conditions (built-in: stepCountIs, hasToolCall; custom via step inspection) and prepareStep callback to dynamically modify model, tools, messages, and settings per step; or implement manual loop with generateText/streamText for full control.

## Stop Conditions

Control agent loop execution with `stopWhen` parameter. Default stops after 20 steps using `stepCountIs(20)`.

Built-in conditions:
- `stepCountIs(n)` - stop after n steps
- `hasToolCall('toolName')` - stop after calling specific tool

Combine multiple conditions in an array; loop stops when any condition is met.

Custom conditions receive step information:
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

The `prepareStep` callback runs before each step and can modify model, tools, messages, and other settings. Receives `{ model, stepNumber, steps, messages }`.

Dynamic model selection:
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

Tool selection by phase:
```ts
prepareStep: async ({ stepNumber, steps }) => {
  if (stepNumber <= 2) {
    return { activeTools: ['search'], toolChoice: 'required' };
  }
  if (stepNumber <= 5) {
    return { activeTools: ['analyze'] };
  }
  return { activeTools: ['summarize'], toolChoice: 'required' };
}
```

Force specific tool:
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

Message transformation:
```ts
prepareStep: async ({ messages, stepNumber }) => {
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

For complete control, use `generateText` or `streamText` directly:
```ts
import { generateText, ModelMessage } from 'ai';

const messages: ModelMessage[] = [{ role: 'user', content: '...' }];
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

Provides control over message history, step-by-step decisions, custom stopping, dynamic tool/model selection, and error handling.

### configuring_call_options
Type-safe runtime configuration for agents via callOptionsSchema and prepareCall to dynamically modify models, tools, instructions, and provider options per request.

## Call Options Overview

Call options allow passing type-safe structured inputs to agents to dynamically modify behavior at runtime without creating multiple agent instances.

## Why Use Call Options

- Add dynamic context (documents, preferences, session data) to prompts
- Select models dynamically based on request complexity
- Configure tools per request (e.g., pass user location to search tools)
- Customize provider options (reasoning effort, temperature, etc.)

## Implementation Pattern

Define call options in three steps:

1. Define schema with `callOptionsSchema` using Zod
2. Configure with `prepareCall` function to modify agent settings
3. Pass options at runtime to `generate()` or `stream()`

## Examples

**Basic user context injection:**
```ts
const supportAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  callOptionsSchema: z.object({
    userId: z.string(),
    accountType: z.enum(['free', 'pro', 'enterprise']),
  }),
  instructions: 'You are a helpful customer support agent.',
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + `\nUser context:
- Account type: ${options.accountType}
- User ID: ${options.userId}`,
  }),
});

await supportAgent.generate({
  prompt: 'How do I upgrade my account?',
  options: { userId: 'user_123', accountType: 'free' },
});
```

**Dynamic model selection:**
```ts
const agent = new ToolLoopAgent({
  model: 'openai/gpt-4o-mini',
  callOptionsSchema: z.object({ complexity: z.enum(['simple', 'complex']) }),
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    model: options.complexity === 'simple' ? 'openai/gpt-4o-mini' : 'openai/o1-mini',
  }),
});

await agent.generate({ prompt: 'What is 2+2?', options: { complexity: 'simple' } });
await agent.generate({ prompt: 'Explain quantum entanglement', options: { complexity: 'complex' } });
```

**Dynamic tool configuration:**
```ts
const newsAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  callOptionsSchema: z.object({
    userCity: z.string().optional(),
    userRegion: z.string().optional(),
  }),
  tools: { web_search: openai.tools.webSearch() },
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    tools: {
      web_search: openai.tools.webSearch({
        searchContextSize: 'low',
        userLocation: {
          type: 'approximate',
          city: options.userCity,
          region: options.userRegion,
          country: 'US',
        },
      }),
    },
  }),
});

await newsAgent.generate({
  prompt: 'What are the top local news stories?',
  options: { userCity: 'San Francisco', userRegion: 'California' },
});
```

**Provider-specific options:**
```ts
const agent = new ToolLoopAgent({
  model: 'openai/o1-mini',
  callOptionsSchema: z.object({ taskDifficulty: z.enum(['low', 'medium', 'high']) }),
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    providerOptions: {
      openai: { reasoningEffort: options.taskDifficulty },
    },
  }),
});

await agent.generate({ prompt: 'Analyze this complex scenario...', options: { taskDifficulty: 'high' } });
```

**Retrieval Augmented Generation (RAG):**
```ts
const ragAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  callOptionsSchema: z.object({ query: z.string() }),
  prepareCall: async ({ options, ...settings }) => {
    const documents = await vectorSearch(options.query);
    return {
      ...settings,
      instructions: `Answer questions using the following context:\n\n${documents.map(doc => doc.content).join('\n\n')}`,
    };
  },
});

await ragAgent.generate({
  prompt: 'What is our refund policy?',
  options: { query: 'refund policy' },
});
```

Note: `prepareCall` can be async, enabling data fetching before agent configuration.

**Combining multiple modifications:**
```ts
const agent = new ToolLoopAgent({
  model: 'openai/gpt-5-nano',
  callOptionsSchema: z.object({
    userRole: z.enum(['admin', 'user']),
    urgency: z.enum(['low', 'high']),
  }),
  tools: { readDatabase: readDatabaseTool, writeDatabase: writeDatabaseTool },
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    model: options.urgency === 'high' ? 'anthropic/claude-sonnet-4.5' : settings.model,
    activeTools: options.userRole === 'admin' ? ['readDatabase', 'writeDatabase'] : ['readDatabase'],
    instructions: `You are a ${options.userRole} assistant.\n${options.userRole === 'admin' ? 'You have full database access.' : 'You have read-only access.'}`,
  }),
});

await agent.generate({
  prompt: 'Update the user record',
  options: { userRole: 'admin', urgency: 'high' },
});
```

**Using with createAgentUIStreamResponse:**
```ts
export async function POST(request: Request) {
  const { messages, userId, accountType } = await request.json();
  return createAgentUIStreamResponse({
    agent: myAgent,
    messages,
    options: { userId, accountType },
  });
}
```

