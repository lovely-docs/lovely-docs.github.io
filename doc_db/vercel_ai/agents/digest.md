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