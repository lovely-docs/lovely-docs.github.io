

## Pages

### overview
Four core functions for LLM integration: generateText (non-interactive), streamText (interactive), generateObject (structured output), streamObject (streamed structured output).

AI SDK Core simplifies working with Large Language Models by providing a standardized interface for integrating them into applications.

**Core Functions:**

- `generateText`: Generates text and tool calls for non-interactive use cases like automation tasks (drafting emails, summarizing web pages) and agents that use tools.
- `streamText`: Streams text and tool calls for interactive use cases like chatbots and content streaming.
- `generateObject`: Generates a typed, structured object matching a Zod schema for information extraction, synthetic data generation, or classification tasks.
- `streamObject`: Streams a structured object matching a Zod schema for streaming generated UIs.

All functions use a standardized approach to setting up prompts and settings, making it easier to work with different models without worrying about technical details.

### generating_text
generateText for complete text generation, streamText for streaming; both support callbacks (onFinish, onError, onChunk), result properties (text, usage, toolCalls, sources, etc.), stream transformations, and provider-specific metadata.

## Overview

The AI SDK Core provides two functions for text generation from LLMs:
- `generateText`: Generates complete text for non-interactive use cases (drafting, summarizing, agents with tools)
- `streamText`: Streams text for interactive use cases (chatbots, real-time applications)

## generateText

Generates text and returns a result object with the complete response:

```tsx
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

With system prompts and complex instructions:

```tsx
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You are a professional writer. You write simple, clear, and concise content.',
  prompt: `Summarize the following article in 3-5 sentences: ${article}`,
});
```

Result object properties:
- `text`: The generated text
- `content`: Content generated in the last step
- `reasoning`: Full reasoning from the model
- `reasoningText`: Reasoning text (some models only)
- `files`: Generated files
- `sources`: Reference sources used (some models only)
- `toolCalls`: Tool calls made
- `toolResults`: Results of tool calls
- `finishReason`: Why generation stopped
- `usage`: Token usage for final step
- `totalUsage`: Total usage across all steps
- `warnings`: Provider warnings
- `request`: Additional request info
- `response`: Full response with headers and body
- `providerMetadata`: Provider-specific metadata
- `steps`: Details for all intermediate steps
- `output`: Generated structured output

Access raw response headers and body via `result.response.headers` and `result.response.body`.

`onFinish` callback is triggered after generation completes with text, usage, finishReason, messages, steps, and totalUsage:

```tsx
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
    // save chat history, record usage, etc.
    const messages = response.messages;
  },
});
```

## streamText

Streams text from LLMs for interactive use cases where immediate responses are needed:

```ts
import { streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

`result.textStream` is both a `ReadableStream` and `AsyncIterable`. Streaming starts immediately and suppresses errors to prevent crashes; use `onError` callback for error logging.

Helper functions for integration with AI SDK UI:
- `toUIMessageStreamResponse()`: Creates UI Message stream HTTP response
- `pipeUIMessageStreamToResponse()`: Writes UI Message stream to Node.js response
- `toTextStreamResponse()`: Creates simple text stream HTTP response
- `pipeTextStreamToResponse()`: Writes text delta to Node.js response

Uses backpressure - only generates tokens as requested. Must consume stream for it to finish.

Result promises (resolve when stream finishes):
- `text`, `content`, `reasoning`, `reasoningText`, `files`, `sources`, `toolCalls`, `toolResults`, `finishReason`, `usage`, `totalUsage`, `warnings`, `steps`, `request`, `response`, `providerMetadata`

`onError` callback for error handling:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error);
  },
});
```

`onChunk` callback triggered for each stream chunk (text, reasoning, source, tool-call, tool-input-start, tool-input-delta, tool-result, raw):

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onChunk({ chunk }) {
    if (chunk.type === 'text') {
      console.log(chunk.text);
    }
  },
});
```

`onFinish` callback when stream completes with text, usage, finishReason, messages, steps, totalUsage.

`fullStream` property provides all events for custom UI or stream handling:

```tsx
for await (const part of result.fullStream) {
  switch (part.type) {
    case 'start': // stream start
    case 'start-step': // step start
    case 'text-start': // text generation start
    case 'text-delta': // text chunk
    case 'text-end': // text generation end
    case 'reasoning-start': // reasoning start
    case 'reasoning-delta': // reasoning chunk
    case 'reasoning-end': // reasoning end
    case 'source': // source reference
    case 'file': // generated file
    case 'tool-call': // tool invocation
    case 'tool-input-start': // tool input start
    case 'tool-input-delta': // tool input chunk
    case 'tool-input-end': // tool input end
    case 'tool-result': // tool result
    case 'tool-error': // tool error
    case 'finish-step': // step completion
    case 'finish': // stream completion
    case 'error': // error event
    case 'raw': // raw value
  }
}
```

## Stream Transformation

Use `experimental_transform` option to transform streams (filtering, changing, smoothing). Transformations apply before callbacks and promise resolution.

`smoothStream` function smooths text streaming:

```tsx
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```

Custom transformations receive tools and return a TransformStream:

```ts
const upperCaseTransform = <TOOLS extends ToolSet>() =>
  (options: { tools: TOOLS; stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        controller.enqueue(
          chunk.type === 'text'
            ? { ...chunk, text: chunk.text.toUpperCase() }
            : chunk,
        );
      },
    });
```

Call `stopStream()` to stop generation (useful for guardrails). Must simulate `finish-step` and `finish` events to ensure well-formed stream and callback invocation:

```ts
const stopWordTransform = <TOOLS extends ToolSet>() =>
  ({ stopStream }: { stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        if (chunk.type !== 'text') {
          controller.enqueue(chunk);
          return;
        }
        if (chunk.text.includes('STOP')) {
          stopStream();
          controller.enqueue({ type: 'finish-step', finishReason: 'stop', ... });
          controller.enqueue({ type: 'finish', finishReason: 'stop', ... });
          return;
        }
        controller.enqueue(chunk);
      },
    });
```

Multiple transformations can be provided in array - applied in order.

## Sources

Some providers (Perplexity, Google Generative AI) include sources in responses. Sources are limited to web pages grounding the response.

Each URL source has: `id`, `url`, `title` (optional), `providerMetadata`.

With `generateText`:

```ts
const result = await generateText({
  model: 'google/gemini-2.5-flash',
  tools: { google_search: google.tools.googleSearch({}) },
  prompt: 'List the top 5 San Francisco news from the past week.',
});

for (const source of result.sources) {
  if (source.sourceType === 'url') {
    console.log('ID:', source.id);
    console.log('Title:', source.title);
    console.log('URL:', source.url);
    console.log('Provider metadata:', source.providerMetadata);
  }
}
```

With `streamText`, access via `fullStream` property:

```tsx
for await (const part of result.fullStream) {
  if (part.type === 'source' && part.sourceType === 'url') {
    console.log('ID:', part.id);
    console.log('Title:', part.title);
    console.log('URL:', part.url);
    console.log('Provider metadata:', part.providerMetadata);
  }
}
```

Sources also available in `result.sources` promise.

### generating_structured_data
generateObject/streamObject for schema-validated structured data generation; Output.* types for generateText/streamText; supports object/array/enum/no-schema strategies with Zod/Valibot/JSON schemas; error handling with NoObjectGeneratedError; experimental JSON repair.

## Overview
Generate structured data from LLM outputs using `generateObject` and `streamObject` functions. These standardize structured generation across model providers with schema validation to ensure type safety and correctness.

## Core Functions

**generateObject**: Generates structured data from a prompt with schema validation.
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

**streamObject**: Streams generated structured data as it's produced, useful for interactive use cases. Errors are part of the stream and don't throw. Use `onError` callback for error logging:
```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({ /* ... */ }),
  prompt: 'Generate data.',
  onError({ error }) {
    console.error(error);
  },
});
for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

## Schema Support
Use Zod schemas, Valibot, or JSON schemas. Pass Zod objects directly or use `zodSchema` helper. Optionally specify `schemaName` and `schemaDescription` for provider guidance.

## Output Strategies

**object** (default): Returns generated data as an object.

**array**: Generate array of objects. Schema specifies element shape. With `streamObject`, stream elements via `elementStream`:
```ts
const { elementStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z.string().describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});
for await (const hero of elementStream) {
  console.log(hero);
}
```

**enum**: Generate specific enum value for classification. Only with `generateObject`:
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole..."',
});
```

**no-schema**: Generate without schema for dynamic user requests:
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

## Response Access
Access raw response headers and body via `response` property:
```ts
const result = await generateObject({ /* ... */ });
console.log(result.response.headers);
console.log(result.response.body);
```

## Reasoning Access
Access model reasoning via `reasoning` property (if available):
```ts
const result = await generateObject({
  model: 'openai/gpt-5',
  schema: z.object({ /* ... */ }),
  prompt: 'Generate a lasagna recipe.',
  providerOptions: {
    openai: {
      strictJsonSchema: true,
      reasoningSummary: 'detailed',
    },
  },
});
console.log(result.reasoning);
```

## Error Handling
`generateObject` throws `AI_NoObjectGeneratedError` when it cannot generate a valid object. Error properties include:
- `text`: Generated text (raw or tool call text)
- `response`: Metadata about language model response
- `usage`: Request token usage
- `cause`: Underlying error (e.g., JSON parsing error)

```ts
import { generateObject, NoObjectGeneratedError } from 'ai';
try {
  await generateObject({ model, schema, prompt });
} catch (error) {
  if (NoObjectGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Text:', error.text);
    console.log('Response:', error.response);
    console.log('Usage:', error.usage);
  }
}
```

## JSON Repair
Experimental `experimental_repairText` function attempts to repair invalid/malformed JSON:
```ts
const { object } = await generateObject({
  model,
  schema,
  prompt,
  experimental_repairText: async ({ text, error }) => {
    return text + '}'; // example: add closing brace
  },
});
```

## Structured Outputs with generateText and streamText
Use `output` setting with `generateText` and `streamText` for structured data generation.

**generateText with Output.object()**:
```ts
const { output } = await generateText({
  output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable().describe('Age of the person.'),
      contact: z.object({
        type: z.literal('email'),
        value: z.string(),
      }),
      occupation: z.object({
        type: z.literal('employed'),
        company: z.string(),
        position: z.string(),
      }),
    }),
  }),
  prompt: 'Generate an example person for testing.',
});
```

**streamText with Output.object()**:
```ts
const { partialOutputStream } = await streamText({
  output: Output.object({
    schema: z.object({ /* ... */ }),
  }),
  prompt: 'Generate an example person for testing.',
});
```

## Output Types

**Output.text()**: Generate plain text without schema enforcement:
```ts
const { output } = await generateText({
  output: Output.text(),
  prompt: 'Tell me a joke.',
});
```

**Output.object()**: Generate structured object with schema validation. Partial outputs validated as much as possible:
```ts
const { output } = await generateText({
  output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable(),
      labels: z.array(z.string()),
    }),
  }),
  prompt: 'Generate information for a test user.',
});
```

**Output.array()**: Generate array of typed objects. Model returns object with `elements` property; SDK extracts and validates:
```ts
const { output } = await generateText({
  output: Output.array({
    element: z.object({
      location: z.string(),
      temperature: z.number(),
      condition: z.string(),
    }),
  }),
  prompt: 'List the weather for San Francisco and Paris.',
});
// Returns: [
//   { location: 'San Francisco', temperature: 70, condition: 'Sunny' },
//   { location: 'Paris', temperature: 65, condition: 'Cloudy' },
// ]
```

**Output.choice()**: Model chooses from specific string options for classification:
```ts
const { output } = await generateText({
  output: Output.choice({
    options: ['sunny', 'rainy', 'snowy'],
  }),
  prompt: 'Is the weather sunny, rainy, or snowy today?',
});
// Returns one of: 'sunny', 'rainy', or 'snowy'
```

**Output.json()**: Generate and parse unstructured JSON without schema enforcement. Useful for arbitrary objects, flexible structures, or dynamic data:
```ts
const { output } = await generateText({
  output: Output.json(),
  prompt: 'For each city, return the current temperature and weather condition as a JSON object.',
});
// Could return any valid JSON structure
```

### tool_calling
Tool calling: define tools with description/inputSchema/execute, pass to generateText/streamText; multi-step calls with stopWhen; dynamic tools for runtime schemas; tool execution options (toolCallId, messages, abortSignal, context); lifecycle hooks (onInputStart/Delta/Available); error handling (NoSuchToolError, InvalidToolInputError); experimental repair and multi-modal results; MCP server integration.

## Tool Calling

Tools are objects that models can call to perform specific tasks. Each tool has three elements:
- `description`: Optional description influencing tool selection
- `inputSchema`: Zod or JSON schema defining input parameters, validated by the LLM
- `execute`: Optional async function receiving validated inputs, returning a value of generic type `RESULT`

Tools are passed as an object with tool names as keys to `generateText` and `streamText`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

## Multi-Step Calls (stopWhen)

With `stopWhen`, enable multi-step calls where the SDK triggers new generations passing tool results until no further tool calls occur or stopping condition is met. Conditions are only evaluated when the last step contains tool results.

Example with `stepCountIs(5)` stopping after maximum 5 steps:

```ts
const { text, steps } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: tool({ /* ... */ }) },
  stopWhen: stepCountIs(5),
  prompt: 'What is the weather in San Francisco?',
});
```

Access intermediate tool calls and results via the `steps` property:

```ts
const allToolCalls = steps.flatMap(step => step.toolCalls);
```

### Callbacks

**`onStepFinish`**: Triggered when a step finishes with all text deltas, tool calls, and tool results available:

```ts
const result = await generateText({
  onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
    // your logic, e.g. saving chat history
  },
});
```

**`prepareStep`**: Called before a step starts with parameters `model`, `stopWhen`, `stepNumber`, `steps`, `messages`. Can modify settings including input messages:

```ts
prepareStep: async ({ model, stepNumber, steps, messages }) => {
  if (stepNumber === 0) {
    return {
      model: modelForThisParticularStep,
      toolChoice: { type: 'tool', toolName: 'tool1' },
      activeTools: ['tool1'],
    };
  }
},
```

For longer agentic loops, compress conversation history:

```ts
prepareStep: async ({ stepNumber, steps, messages }) => {
  if (messages.length > 20) {
    return { messages: messages.slice(-10) };
  }
  return {};
},
```

## Response Messages

Both `generateText` and `streamText` have `response.messages` property containing `ModelMessage` objects to add to conversation history:

```ts
const messages: ModelMessage[] = [ /* ... */ ];
const { response } = await generateText({ /* ... */ messages });
messages.push(...response.messages);
```

## Dynamic Tools

`dynamicTool` creates tools with unknown input/output types for MCP tools without schemas, user-defined functions, or externally-loaded tools:

```ts
const customTool = dynamicTool({
  description: 'Execute a custom function',
  inputSchema: z.object({}),
  execute: async input => {
    const { action, parameters } = input as any;
    return { result: `Executed ${action}` };
  },
});
```

Use `toolCall.dynamic` flag for type narrowing in `onStepFinish`:

```ts
for (const toolCall of toolCalls) {
  if (toolCall.dynamic) {
    console.log('Dynamic:', toolCall.toolName, toolCall.input);
    continue;
  }
  switch (toolCall.toolName) {
    case 'weather':
      console.log(toolCall.input.location); // typed as string
      break;
  }
}
```

## Preliminary Tool Results

Return `AsyncIterable` over multiple results where the last value is the final tool result. Useful for streaming status during execution:

```ts
tool({
  description: 'Get the current weather.',
  inputSchema: z.object({ location: z.string() }),
  async *execute({ location }) {
    yield {
      status: 'loading' as const,
      text: `Getting weather for ${location}`,
      weather: undefined,
    };
    await new Promise(resolve => setTimeout(resolve, 3000));
    const temperature = 72 + Math.floor(Math.random() * 21) - 10;
    yield {
      status: 'success' as const,
      text: `The weather in ${location} is ${temperature}°F`,
      temperature,
    };
  },
});
```

## Tool Choice

Control when tools are selected with `toolChoice`:
- `auto` (default): model chooses whether and which tools to call
- `required`: model must call a tool
- `none`: model must not call tools
- `{ type: 'tool', toolName: string }`: model must call specified tool

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: tool({ /* ... */ }) },
  toolChoice: 'required',
  prompt: 'What is the weather in San Francisco?',
});
```

## Tool Execution Options

Tools receive additional options as a second parameter:

**Tool Call ID**: Forward tool-call related information:

```ts
execute: async (args, { toolCallId }) => {
  writer.write({
    type: 'data-tool-status',
    id: toolCallId,
    data: { name: 'myTool', status: 'in-progress' },
  });
},
```

**Messages**: Access message history sent to the model:

```ts
execute: async (args, { messages }) => {
  // use message history in calls to other language models
  return { ... };
},
```

**Abort Signals**: Forward abort signals to long-running computations or fetch calls:

```ts
execute: async ({ location }, { abortSignal }) => {
  return fetch(
    `https://api.weatherapi.com/v1/current.json?q=${location}`,
    { signal: abortSignal },
  );
},
```

**Context (experimental)**: Pass arbitrary context via `experimental_context`:

```ts
const result = await generateText({
  tools: {
    someTool: tool({
      execute: async (input, { experimental_context: context }) => {
        const typedContext = context as { example: string };
      },
    }),
  },
  experimental_context: { example: '123' },
});
```

## Tool Input Lifecycle Hooks

Available hooks (only in streaming with `streamText`):
- `onInputStart`: Called when model starts generating tool input
- `onInputDelta`: Called for each chunk of input text
- `onInputAvailable`: Called when complete input is available and validated

```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    getWeather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
      onInputStart: () => {
        console.log('Tool call starting');
      },
      onInputDelta: ({ inputTextDelta }) => {
        console.log('Received input chunk:', inputTextDelta);
      },
      onInputAvailable: ({ input }) => {
        console.log('Complete input:', input);
      },
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

## Types

Use helper types for type safety in modularized code:
- `ToolCall<NAME extends string, ARGS>`: Type for individual tool calls
- `ToolResult<NAME extends string, ARGS, RESULT>`: Type for tool results
- `TypedToolCall<TOOLS extends ToolSet>`: Extract tool call types from tool set
- `TypedToolResult<TOOLS extends ToolSet>`: Extract tool result types from tool set

```ts
const myToolSet = {
  firstTool: tool({
    description: 'Greets the user',
    inputSchema: z.object({ name: z.string() }),
    execute: async ({ name }) => `Hello, ${name}!`,
  }),
  secondTool: tool({
    description: 'Tells the user their age',
    inputSchema: z.object({ age: z.number() }),
    execute: async ({ age }) => `You are ${age} years old!`,
  }),
};

type MyToolCall = TypedToolCall<typeof myToolSet>;
type MyToolResult = TypedToolResult<typeof myToolSet>;

async function generateSomething(prompt: string): Promise<{
  text: string;
  toolCalls: Array<MyToolCall>;
  toolResults: Array<MyToolResult>;
}> {
  return generateText({
    model: 'anthropic/claude-sonnet-4.5',
    tools: myToolSet,
    prompt,
  });
}
```

## Error Handling

Three tool-call related errors:
- `NoSuchToolError`: Model calls undefined tool
- `InvalidToolInputError`: Tool called with inputs not matching schema
- `ToolCallRepairError`: Error during tool call repair

`generateText` throws errors for schema validation issues, handled with try/catch. Tool execution errors appear as `tool-error` content parts in result steps:

```ts
try {
  const result = await generateText({ /* ... */ });
} catch (error) {
  if (NoSuchToolError.isInstance(error)) {
    // handle no such tool error
  } else if (InvalidToolInputError.isInstance(error)) {
    // handle invalid tool inputs error
  }
}

const { steps } = await generateText({ /* ... */ });
const toolErrors = steps.flatMap(step =>
  step.content.filter(part => part.type === 'tool-error'),
);
toolErrors.forEach(toolError => {
  console.log('Tool error:', toolError.error);
  console.log('Tool name:', toolError.toolName);
  console.log('Tool input:', toolError.input);
});
```

`streamText` sends errors as part of the full stream. Tool execution errors appear as `tool-error` parts, other errors as `error` parts. Use `toUIMessageStreamResponse` with `onError` function:

```ts
const result = streamText({ /* ... */ });
return result.toUIMessageStreamResponse({
  onError: error => {
    if (NoSuchToolError.isInstance(error)) {
      return 'The model tried to call a unknown tool.';
    } else if (InvalidToolInputError.isInstance(error)) {
      return 'The model called a tool with invalid inputs.';
    } else {
      return 'An unknown error occurred.';
    }
  },
});
```

## Tool Call Repair (experimental)

Control how invalid tool calls are repaired without requiring additional steps. Use `experimental_repairToolCall` function with custom repair strategies:

**Strategy 1: Use model with structured outputs**

```ts
const result = await generateText({
  model,
  tools,
  prompt,
  experimental_repairToolCall: async ({
    toolCall,
    tools,
    inputSchema,
    error,
  }) => {
    if (NoSuchToolError.isInstance(error)) {
      return null; // do not attempt to fix invalid tool names
    }
    const tool = tools[toolCall.toolName as keyof typeof tools];
    const { object: repairedArgs } = await generateObject({
      model: 'anthropic/claude-sonnet-4.5',
      schema: tool.inputSchema,
      prompt: [
        `The model tried to call the tool "${toolCall.toolName}" with the following inputs:`,
        JSON.stringify(toolCall.input),
        `The tool accepts the following schema:`,
        JSON.stringify(inputSchema(toolCall)),
        'Please fix the inputs.',
      ].join('\n'),
    });
    return { ...toolCall, input: JSON.stringify(repairedArgs) };
  },
});
```

**Strategy 2: Re-ask strategy**

```ts
const result = await generateText({
  model,
  tools,
  prompt,
  experimental_repairToolCall: async ({
    toolCall,
    tools,
    error,
    messages,
    system,
  }) => {
    const result = await generateText({
      model,
      system,
      messages: [
        ...messages,
        {
          role: 'assistant',
          content: [
            {
              type: 'tool-call',
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.toolName,
              input: toolCall.input,
            },
          ],
        },
        {
          role: 'tool' as const,
          content: [
            {
              type: 'tool-result',
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.toolName,
              output: error.message,
            },
          ],
        },
      ],
      tools,
    });
    const newToolCall = result.toolCalls.find(
      newToolCall => newToolCall.toolName === toolCall.toolName,
    );
    return newToolCall != null
      ? {
          toolCallType: 'function' as const,
          toolCallId: toolCall.toolCallId,
          toolName: toolCall.toolName,
          input: JSON.stringify(newToolCall.input),
        }
      : null;
  },
});
```

## Active Tools

Limit available tools to the model while maintaining static typing with large tool sets using `activeTools` property (array of tool names):

```ts
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: myToolSet,
  activeTools: ['firstTool'],
});
```

## Multi-modal Tool Results (experimental)

Supported by Anthropic and OpenAI. Tools have optional `toModelOutput` function converting tool result into a content part:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    computer: anthropic.tools.computer_20241022({
      async execute({ action, coordinate, text }) {
        switch (action) {
          case 'screenshot': {
            return {
              type: 'image',
              data: fs
                .readFileSync('./data/screenshot-editor.png')
                .toString('base64'),
            };
          }
          default: {
            return `executed ${action}`;
          }
        }
      },
      toModelOutput(result) {
        return {
          type: 'content',
          value:
            typeof result === 'string'
              ? [{ type: 'text', text: result }]
              : [{ type: 'media', data: result.data, mediaType: 'image/png' }],
        };
      },
    }),
  },
});
```

## Extracting Tools

Extract tools into separate files using the `tool` helper function for correct type inference:

```ts
// tools/weather-tool.ts
import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});
```

## MCP Tools

AI SDK supports connecting to Model Context Protocol (MCP) servers to access their tools through a standardized interface. See MCP Tools documentation for initialization, transport options, and usage patterns.

**AI SDK Tools vs MCP Tools comparison:**

| Aspect | AI SDK Tools | MCP Tools |
| --- | --- | --- |
| Type Safety | Full static typing end-to-end | Dynamic discovery at runtime |
| Execution | Same process (low latency) | Separate server (network overhead) |
| Prompt Control | Full control over descriptions and schemas | Controlled by MCP server owner |
| Schema Control | You define and optimize for your model | Controlled by MCP server owner |
| Version Management | Full visibility over updates | Can update independently (version skew risk) |
| Authentication | Same process, no additional auth required | Separate server introduces additional auth complexity |
| Best For | Production applications requiring control and performance | Development iteration, user-provided tools |

### model_context_protocol_(mcp)
Connect to MCP servers via HTTP/SSE/stdio transport to access tools (with schema discovery or explicit Zod schemas), resources (list/read/templates), and prompts (list/get with args); handle elicitation requests for server-initiated client input.

## Overview
Connect to Model Context Protocol (MCP) servers to access their tools, resources, and prompts through a standardized interface. The feature is experimental.

## Initializing MCP Client

Three transport options available:

**HTTP Transport (Recommended for production)**
```typescript
const mcpClient = await createMCPClient({
  transport: {
    type: 'http',
    url: 'https://your-server.com/mcp',
    headers: { Authorization: 'Bearer my-api-key' },
    authProvider: myOAuthClientProvider, // optional OAuth
  },
});
```

**SSE Transport (Alternative HTTP-based)**
```typescript
const mcpClient = await createMCPClient({
  transport: {
    type: 'sse',
    url: 'https://my-server.com/sse',
    headers: { Authorization: 'Bearer my-api-key' },
    authProvider: myOAuthClientProvider,
  },
});
```

**Stdio Transport (Local development only)**
```typescript
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const mcpClient = await createMCPClient({
  transport: new StdioClientTransport({
    command: 'node',
    args: ['src/stdio/dist/server.js'],
  }),
});
```

You can also use `StreamableHTTPClientTransport` from MCP's official SDK or implement custom transport via `MCPTransport` interface.

**Client Lifecycle**: Close the client when done. For streaming responses, use `onFinish` callback. For non-streaming, use try/finally.

```typescript
const result = await streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools,
  prompt: 'What is the weather in Brooklyn, New York?',
  onFinish: async () => {
    await mcpClient.close();
  },
});
```

## Using MCP Tools

Two approaches for tool schemas:

**Schema Discovery** - Automatically list all server tools with inferred types:
```typescript
const tools = await mcpClient.tools();
```
Simpler but no TypeScript type safety.

**Schema Definition** - Explicitly define tools with Zod schemas for type safety:
```typescript
const tools = await mcpClient.tools({
  schemas: {
    'get-data': {
      inputSchema: z.object({
        query: z.string().describe('The data query'),
        format: z.enum(['json', 'text']).optional(),
      }),
    },
    'tool-with-no-args': {
      inputSchema: z.object({}),
    },
  },
});
```

## Using MCP Resources

Resources are application-driven data sources that provide context. Unlike tools (model-controlled), your application decides when to fetch resources.

**List resources:**
```typescript
const resources = await mcpClient.listResources();
```

**Read resource contents:**
```typescript
const resourceData = await mcpClient.readResource({
  uri: 'file:///example/document.txt',
});
```

**List resource templates** (dynamic URI patterns):
```typescript
const templates = await mcpClient.listResourceTemplates();
```

## Using MCP Prompts

Prompts are user-controlled templates servers expose.

**List prompts:**
```typescript
const prompts = await mcpClient.listPrompts();
```

**Get a prompt with optional arguments:**
```typescript
const prompt = await mcpClient.getPrompt({
  name: 'code_review',
  arguments: { code: 'function add(a, b) { return a + b; }' },
});
```

## Handling Elicitation Requests

Elicitation allows MCP servers to request additional information from the client during tool execution (e.g., user confirmation, form input).

**Enable elicitation capability:**
```typescript
const mcpClient = await experimental_createMCPClient({
  transport: {
    type: 'sse',
    url: 'https://your-server.com/sse',
  },
  capabilities: {
    elicitation: {},
  },
});
```

**Register elicitation handler:**
```typescript
mcpClient.onElicitationRequest(ElicitationRequestSchema, async request => {
  // request.params.message: description of needed input
  // request.params.requestedSchema: JSON schema for expected input

  const userInput = await getInputFromUser(
    request.params.message,
    request.params.requestedSchema,
  );

  return {
    action: 'accept', // or 'decline' or 'cancel'
    content: userInput, // required only for 'accept'
  };
});
```

Response actions: `'accept'` (with content), `'decline'`, or `'cancel'`.

### prompt_engineering
Best practices for tool prompts, Zod schema patterns (dates, nullable optionals), temperature=0 for determinism, and debugging via warnings/request bodies.

## Tips for Tool Prompts

When creating prompts with tools, follow these practices:

1. Use strong tool-calling models like `gpt-4.1` or `gpt-5`; weaker models struggle with tool calls
2. Keep tool count low (≤5) and parameter complexity minimal
3. Use semantically meaningful names for tools, parameters, and properties
4. Add `.describe("...")` to Zod schema properties to hint at their purpose
5. Document tool output in the `description` field when outputs are unclear or tools have dependencies
6. Include JSON example input/outputs of tool calls in prompts to demonstrate usage

## Tool & Structured Data Schemas

**Zod Dates**: Models return dates as strings, not Date objects. Use `z.string().datetime()` or `z.string().date()` with a transformer:

```ts
const result = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({
    events: z.array(
      z.object({
        event: z.string(),
        date: z.string().date().transform(value => new Date(value)),
      }),
    ),
  }),
  prompt: 'List 5 important events from the year 2000.',
});
```

**Optional Parameters**: For strict schema validation compatibility (especially OpenAI structured outputs), use `.nullable()` instead of `.optional()`:

```ts
// Fails with strict validation
const failingTool = tool({
  description: 'Execute a command',
  inputSchema: z.object({
    command: z.string(),
    workdir: z.string().optional(),
  }),
});

// Works with strict validation
const workingTool = tool({
  description: 'Execute a command',
  inputSchema: z.object({
    command: z.string(),
    workdir: z.string().nullable(),
  }),
});
```

**Temperature Settings**: Use `temperature: 0` for tool calls and object generation to ensure deterministic results:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  temperature: 0,
  tools: {
    myTool: tool({
      description: 'Execute a command',
      inputSchema: z.object({ command: z.string() }),
    }),
  },
  prompt: 'Execute the ls command',
});
```

Lower temperature reduces randomness, critical for structured data generation, precise tool calls, and strict schema compliance.

## Debugging

**Inspecting Warnings**: Check provider support for features via `result.warnings`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Hello, world!',
});
console.log(result.warnings);
```

**HTTP Request Bodies**: Inspect raw request payloads via `result.request.body`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Hello, world!',
});
console.log(result.request.body);
```

### settings
Common settings for all AI SDK functions: output control (maxOutputTokens, stopSequences), sampling (temperature/topP/topK/seed), penalties (presencePenalty/frequencyPenalty), request control (maxRetries, abortSignal), and HTTP headers.

## Common Settings

All AI SDK functions support these settings alongside the model and prompt:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  maxOutputTokens: 512,
  temperature: 0.3,
  maxRetries: 5,
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Note:** Some providers don't support all settings. Check the `warnings` property in the result object for unsupported settings.

## Output Control

- **`maxOutputTokens`**: Maximum number of tokens to generate.
- **`stopSequences`**: Array of sequences that stop text generation when encountered. Providers may limit the number of sequences.

## Sampling & Randomness

- **`temperature`**: Controls output randomness. `0` means deterministic, higher values mean more randomness. Range depends on provider/model. Recommended to set either `temperature` or `topP`, not both. Default in AI SDK 5.0+ is no longer `0`.
- **`topP`**: Nucleus sampling between 0 and 1. E.g., `0.1` considers only top 10% probability tokens. Recommended to set either `temperature` or `topP`, not both.
- **`topK`**: Sample only from top K options per token. Removes low-probability responses. For advanced use cases only.
- **`seed`**: Integer seed for deterministic results if supported by the model.

## Penalties

- **`presencePenalty`**: Reduces likelihood of repeating information already in the prompt. `0` means no penalty. Range depends on provider/model.
- **`frequencyPenalty`**: Reduces likelihood of repeating same words/phrases. `0` means no penalty. Range depends on provider/model.

## Request Control

- **`maxRetries`**: Maximum retry attempts. Default: `2`. Set to `0` to disable.
- **`abortSignal`**: Cancels the call. Can be used for timeouts:
  ```ts
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Invent a new holiday and describe its traditions.',
    abortSignal: AbortSignal.timeout(5000), // 5 seconds
  });
  ```

## HTTP Headers

- **`headers`**: Additional HTTP headers for HTTP-based providers. Useful for observability headers like `Prompt-Id`:
  ```ts
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Invent a new holiday and describe its traditions.',
    headers: {
      'Prompt-Id': 'my-prompt-id',
    },
  });
  ```
  Note: Separate from provider-level headers which apply to all requests.

### embeddings
embed() and embedMany() functions for converting text to vectors; cosineSimilarity() for measuring similarity; configurable via providerOptions, maxParallelCalls, maxRetries, abortSignal, headers; supports OpenAI, Google, Mistral, Cohere, Amazon Bedrock models; middleware support via wrapEmbeddingModel().

## Embedding Single Values

Use the `embed` function to embed single values for tasks like finding similar words or clustering text:

```tsx
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

## Embedding Multiple Values

Use `embedMany` for batch embedding when preparing data stores for RAG:

```tsx
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```

## Calculating Similarity

Use `cosineSimilarity` to measure similarity between embeddings:

```ts
import { openai } from '@ai-sdk/openai';
import { cosineSimilarity, embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});

console.log(`cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`);
```

## Token Usage

Both `embed` and `embedMany` return token usage information:

```ts
const { embedding, usage } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});

console.log(usage); // { tokens: 10 }
```

## Configuration Options

**Provider Options**: Configure provider-specific parameters via `providerOptions`:

```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  providerOptions: {
    openai: {
      dimensions: 512,
    },
  },
});
```

**Parallel Requests**: Control concurrency with `maxParallelCalls`:

```ts
const { embeddings, usage } = await embedMany({
  maxParallelCalls: 2,
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city', 'snowy night in the mountains'],
});
```

**Retries**: Set `maxRetries` (defaults to 2, meaning 3 total attempts):

```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  maxRetries: 0,
});
```

**Abort Signals and Timeouts**: Use `abortSignal` to abort or timeout:

```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  abortSignal: AbortSignal.timeout(1000),
});
```

**Custom Headers**: Add custom headers via `headers` parameter:

```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

## Response Information

Access raw provider response via the `response` property:

```ts
const { embedding, response } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});

console.log(response);
```

## Embedding Middleware

Enhance embedding models using `wrapEmbeddingModel` and `EmbeddingModelV3Middleware`:

```ts
import {
  customProvider,
  defaultEmbeddingSettingsMiddleware,
  embed,
  wrapEmbeddingModel,
  gateway,
} from 'ai';

const embeddingModelWithDefaults = wrapEmbeddingModel({
  model: gateway.embeddingModel('google/gemini-embedding-001'),
  middleware: defaultEmbeddingSettingsMiddleware({
    settings: {
      providerOptions: {
        google: {
          outputDimensionality: 256,
          taskType: 'CLASSIFICATION',
        },
      },
    },
  }),
});
```

## Supported Embedding Models

| Provider | Model | Dimensions |
|----------|-------|-----------|
| OpenAI | text-embedding-3-large | 3072 |
| OpenAI | text-embedding-3-small | 1536 |
| OpenAI | text-embedding-ada-002 | 1536 |
| Google Generative AI | gemini-embedding-001 | 3072 |
| Google Generative AI | text-embedding-004 | 768 |
| Mistral | mistral-embed | 1024 |
| Cohere | embed-english-v3.0 | 1024 |
| Cohere | embed-multilingual-v3.0 | 1024 |
| Cohere | embed-english-light-v3.0 | 384 |
| Cohere | embed-multilingual-light-v3.0 | 384 |
| Cohere | embed-english-v2.0 | 4096 |
| Cohere | embed-english-light-v2.0 | 1024 |
| Cohere | embed-multilingual-v2.0 | 768 |
| Amazon Bedrock | amazon.titan-embed-text-v1 | 1536 |
| Amazon Bedrock | amazon.titan-embed-text-v2:0 | 1024 |

### reranking
Rerank documents by query relevance using trained models; supports strings and objects; configure with topN, providerOptions, maxRetries, abortSignal, headers; available from Cohere, Bedrock, Together.ai.

## Reranking Documents

Reranking improves search relevance by reordering documents based on their relevance to a query. Unlike embedding-based similarity search, reranking models are specifically trained to understand query-document relationships and produce more accurate relevance scores.

Use the `rerank` function with reranking models like `cohere.reranking('rerank-v3.5')` or `bedrock.reranking('cohere.rerank-v3-5:0')`:

```tsx
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const documents = [
  'sunny day at the beach',
  'rainy afternoon in the city',
  'snowy night in the mountains',
];

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

## Object Documents

Reranking supports structured documents (JSON objects) for searching databases, emails, or other structured content:

```tsx
const documents = [
  {
    from: 'Paul Doe',
    subject: 'Follow-up',
    text: 'We are happy to give you a discount of 20% on your next order.',
  },
  {
    from: 'John McGill',
    subject: 'Missing Info',
    text: 'Sorry, but here is the pricing information from Oracle: $5000/month',
  },
];

const { ranking, rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});

console.log(rerankedDocuments[0]);
// { from: 'John McGill', subject: 'Missing Info', text: '...' }
```

## Result Object

The `rerank` function returns:
- `ranking`: sorted array of `{ originalIndex, score, document }` objects
- `rerankedDocuments`: documents sorted by relevance (convenience property)
- `originalDocuments`: original documents array
- `response`: raw provider response with `{ id, timestamp, modelId, headers, body }`

Each ranking item contains:
- `originalIndex`: position in original documents array
- `score`: relevance score (typically 0-1, higher is more relevant)
- `document`: the original document

## Configuration Options

**topN**: Limit results to the N most relevant documents:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'],
  query: 'relevant information',
  topN: 3,
});
```

**providerOptions**: Provider-specific parameters:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  providerOptions: {
    cohere: {
      maxTokensPerDoc: 1000,
    },
  },
});
```

**maxRetries**: Set maximum retries (defaults to 2, meaning 3 total attempts):
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  maxRetries: 0,
});
```

**abortSignal**: Abort or timeout the reranking process:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  abortSignal: AbortSignal.timeout(5000),
});
```

**headers**: Add custom headers to the request:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

## Available Providers & Models

| Provider | Model |
| --- | --- |
| Cohere | `rerank-v3.5` |
| Cohere | `rerank-english-v3.0` |
| Cohere | `rerank-multilingual-v3.0` |
| Amazon Bedrock | `amazon.rerank-v1:0` |
| Amazon Bedrock | `cohere.rerank-v3-5:0` |
| Together.ai | `Salesforce/Llama-Rank-v1` |
| Together.ai | `mixedbread-ai/Mxbai-Rerank-Large-V2` |

### image_generation
Generate images from text prompts using `generateImage()` with configurable size/aspect ratio, batch generation, seeds, provider-specific options, abort signals, custom headers, and error handling; supports multiple providers (OpenAI, Google, Fal, DeepInfra, etc.); some language models return images via `files` property.

## Image Generation with AI SDK

The `generateImage` function generates images from text prompts using image models from various providers.

### Basic Usage
```tsx
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});

const base64 = image.base64;
const uint8Array = image.uint8Array;
```

### Size and Aspect Ratio
Specify size as `{width}x{height}` string (e.g., `1024x1024`) or aspect ratio as `{width}:{height}` string (e.g., `16:9`). Supported values vary by model and provider.

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  size: '1024x1024',
});

const { image } = await generateImage({
  model: vertex.image('imagen-3.0-generate-002'),
  prompt: 'Santa Claus driving a Cadillac',
  aspectRatio: '16:9',
});
```

### Multiple Images
Use the `n` parameter to generate multiple images. The SDK automatically batches requests based on model limits (e.g., DALL-E 3 generates 1 per call, DALL-E 2 supports up to 10). Override with `maxImagesPerCall`:

```tsx
const { images } = await generateImage({
  model: openai.image('dall-e-2'),
  prompt: 'Santa Claus driving a Cadillac',
  n: 4,
});

const { images } = await generateImage({
  model: openai.image('dall-e-2'),
  prompt: 'Santa Claus driving a Cadillac',
  maxImagesPerCall: 5,
  n: 10, // Makes 2 calls of 5 images each
});
```

### Seed
Provide a seed to control reproducibility (if supported by model):

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  seed: 1234567890,
});
```

### Provider-Specific Settings
Pass model-specific options via `providerOptions`:

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  size: '1024x1024',
  providerOptions: {
    openai: { style: 'vivid', quality: 'hd' },
  },
});
```

### Abort Signals and Timeouts
Use `abortSignal` to abort or timeout requests:

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  abortSignal: AbortSignal.timeout(1000),
});
```

### Custom Headers
Add custom headers via `headers` parameter:

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### Warnings and Metadata
Access warnings for unsupported parameters and provider-specific metadata:

```tsx
const { image, warnings } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});

const { image, providerMetadata } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});

const revisedPrompt = providerMetadata.openai.images[0]?.revisedPrompt;
```

### Error Handling
Catch `AI_NoImageGeneratedError` when image generation fails:

```tsx
import { generateImage, NoImageGeneratedError } from 'ai';

try {
  await generateImage({ model, prompt });
} catch (error) {
  if (NoImageGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

### Language Models with Image Output
Some language models like `gemini-2.5-flash-image-preview` support multi-modal outputs. Access generated images via the `files` property:

```tsx
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const result = await generateText({
  model: google('gemini-2.5-flash-image-preview'),
  prompt: 'Generate an image of a comic cat',
});

for (const file of result.files) {
  if (file.mediaType.startsWith('image/')) {
    const base64 = file.base64;
    const uint8Array = file.uint8Array;
    const mediaType = file.mediaType;
  }
}
```

### Supported Image Models
Comprehensive table of image models from providers including xAI Grok, OpenAI (gpt-image-1, dall-e-3, dall-e-2), Amazon Bedrock, Fal, DeepInfra, Replicate, Google, Google Vertex, Fireworks, Luma, Together.ai, and Black Forest Labs. Each model lists supported sizes or aspect ratios.

### transcription
Transcribe audio to text using `transcribe()` with configurable models from OpenAI, Groq, Deepgram, and other providers; supports provider options, timeouts, custom headers, and error handling via NoTranscriptGeneratedError.

## Overview
The `transcribe` function converts audio to text using transcription models. It's currently an experimental feature.

## Basic Usage
```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});
```

The `audio` parameter accepts: `Uint8Array`, `ArrayBuffer`, `Buffer`, base64-encoded string, or URL.

## Transcript Output
Access transcript data via properties:
- `text`: The transcribed text (e.g., "Hello, world!")
- `segments`: Array of segments with start/end times (if available)
- `language`: Language code (e.g., "en", if available)
- `durationInSeconds`: Audio duration (if available)
- `warnings`: Array of warnings about unsupported parameters

## Configuration

### Provider-Specific Settings
Use `providerOptions` to pass model-specific parameters:
```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  providerOptions: {
    openai: {
      timestampGranularities: ['word'],
    },
  },
});
```

### Abort Signals and Timeouts
Pass an `abortSignal` to abort or timeout the transcription:
```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  abortSignal: AbortSignal.timeout(1000),
});
```

### Custom Headers
Add custom headers via the `headers` parameter:
```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

## Error Handling
When transcription fails, `AI_NoTranscriptGeneratedError` is thrown. This can occur if the model fails to generate a response or the response cannot be parsed.

The error provides:
- `responses`: Metadata about model responses (timestamp, model, headers)
- `cause`: The underlying error cause

```ts
import { experimental_transcribe as transcribe, NoTranscriptGeneratedError } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

try {
  await transcribe({
    model: openai.transcription('whisper-1'),
    audio: await readFile('audio.mp3'),
  });
} catch (error) {
  if (NoTranscriptGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

## Supported Models
Multiple providers offer transcription models:
- **OpenAI**: `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`
- **ElevenLabs**: `scribe_v1`, `scribe_v1_experimental`
- **Groq**: `whisper-large-v3-turbo`, `distil-whisper-large-v3-en`, `whisper-large-v3`
- **Azure OpenAI**: `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`
- **Rev.ai**: `machine`, `low_cost`, `fusion`
- **Deepgram**: `base`, `enhanced`, `nova`, `nova-2`, `nova-3` (with variants)
- **Gladia**: `default`
- **AssemblyAI**: `best`, `nano`
- **Fal**: `whisper`, `wizper`

### speech
generateSpeech converts text to audio using OpenAI/ElevenLabs/LMNT/Hume models; supports language, voice, abort signals, custom headers, provider options; throws NoSpeechGeneratedError with response metadata.

## Overview
The `generateSpeech` function converts text to speech using speech models from various providers. It's currently an experimental feature.

## Basic Usage
```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  voice: 'alloy',
});
const audioData = audio.audioData; // Uint8Array
```

## Language Support
Specify language with the `language` parameter (provider-dependent):
```ts
const audio = await generateSpeech({
  model: lmnt.speech('aurora'),
  text: 'Hola, mundo!',
  language: 'es',
});
```

## Configuration Options

**Provider-Specific Settings**: Use `providerOptions` to pass model-specific configuration:
```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  providerOptions: {
    openai: { /* provider-specific options */ },
  },
});
```

**Abort Signals and Timeouts**: Pass `abortSignal` to abort or timeout:
```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  abortSignal: AbortSignal.timeout(1000),
});
```

**Custom Headers**: Add custom headers via `headers` parameter:
```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

**Warnings**: Access warnings on the `warnings` property for unsupported parameters.

## Error Handling
`generateSpeech` throws `AI_NoSpeechGeneratedError` when generation fails. The error includes:
- `responses`: Metadata about model responses (timestamp, model, headers)
- `cause`: Detailed error cause

```ts
import { experimental_generateSpeech as generateSpeech, NoSpeechGeneratedError } from 'ai';
import { openai } from '@ai-sdk/openai';

try {
  await generateSpeech({
    model: openai.speech('tts-1'),
    text: 'Hello, world!',
  });
} catch (error) {
  if (NoSpeechGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

## Supported Speech Models
- **OpenAI**: tts-1, tts-1-hd, gpt-4o-mini-tts
- **ElevenLabs**: eleven_v3, eleven_multilingual_v2, eleven_flash_v2_5, eleven_flash_v2, eleven_turbo_v2_5, eleven_turbo_v2
- **LMNT**: aurora, blizzard
- **Hume**: default

Additional models available in respective provider documentation.

### language_model_middleware
Middleware system for intercepting/modifying language model calls; built-in options for reasoning extraction, streaming simulation, defaults; custom implementation via transformParams/wrapGenerate/wrapStream; examples: logging, caching, RAG, guardrails, per-request metadata.

Language model middleware intercepts and modifies language model calls to add features like guardrails, RAG, caching, and logging in a model-agnostic way.

**Using Middleware:**
Wrap a model with `wrapLanguageModel({ model, middleware })`. Multiple middlewares are applied in order: `wrapLanguageModel({ model, middleware: [first, second] })` applies as `first(second(model))`.

**Built-in Middleware:**
- `extractReasoningMiddleware({ tagName: 'think' })`: Extracts reasoning from special tags and exposes as `reasoning` property. Supports `startWithReasoning` option to prepend tags.
- `simulateStreamingMiddleware()`: Simulates streaming for non-streaming models.
- `defaultSettingsMiddleware({ settings: { temperature, maxOutputTokens, providerOptions } })`: Applies default settings.

**Community Middleware:**
- Custom tool call parser (`@ai-sdk-tool/parser`): Enables function calling on models without native support via `createToolMiddleware`, `hermesToolMiddleware`, or `gemmaToolMiddleware`. Example: `wrapLanguageModel({ model: openrouter('google/gemma-3-27b-it'), middleware: gemmaToolMiddleware })`.

**Implementing Custom Middleware:**
Implement `LanguageModelV3Middleware` with any of:
1. `transformParams`: Modifies parameters before passing to model (for both `doGenerate` and `doStream`).
2. `wrapGenerate`: Wraps `doGenerate` method to modify params, call model, and modify result.
3. `wrapStream`: Wraps `doStream` method similarly.

**Examples:**

Logging - logs params and generated text:
```ts
export const yourLogMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('doGenerate called', JSON.stringify(params, null, 2));
    const result = await doGenerate();
    console.log('generated text:', result.text);
    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    console.log('doStream called', JSON.stringify(params, null, 2));
    const { stream, ...rest } = await doStream();
    let generatedText = '';
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        if (chunk.type === 'text-delta') generatedText += chunk.delta;
        controller.enqueue(chunk);
      },
      flush() { console.log('generated text:', generatedText); }
    });
    return { stream: stream.pipeThrough(transformStream), ...rest };
  }
};
```

Caching - caches results by stringified params:
```ts
const cache = new Map();
export const yourCacheMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params);
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    const result = await doGenerate();
    cache.set(cacheKey, result);
    return result;
  }
};
```

RAG - augments last user message with retrieved sources:
```ts
export const yourRagMiddleware: LanguageModelV3Middleware = {
  transformParams: async ({ params }) => {
    const lastUserMessageText = getLastUserMessageText({ prompt: params.prompt });
    if (!lastUserMessageText) return params;
    const instruction = 'Use the following information:\n' + 
      findSources({ text: lastUserMessageText }).map(c => JSON.stringify(c)).join('\n');
    return addToLastUserMessage({ params, text: instruction });
  }
};
```

Guardrails - filters generated text:
```ts
export const yourGuardrailMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate }) => {
    const { text, ...rest } = await doGenerate();
    const cleanedText = text?.replace(/badword/g, '<REDACTED>');
    return { text: cleanedText, ...rest };
  }
};
```

**Custom Metadata Per Request:**
Pass metadata via `providerOptions` to access in middleware:
```ts
const { text } = await generateText({
  model: wrapLanguageModel({
    model: 'anthropic/claude-sonnet-4.5',
    middleware: yourLogMiddleware
  }),
  prompt: 'Invent a new holiday...',
  providerOptions: { yourLogMiddleware: { hello: 'world' } }
});
```
In middleware: `params?.providerMetadata?.yourLogMiddleware` contains the passed metadata.

### provider_&_model_management
Manage multiple providers and models via custom providers (pre-configure settings/aliases/limits), provider registry (access via `providerId:modelId`), and global provider configuration (use plain model IDs with default provider).

## Custom Providers

Create custom providers using `customProvider()` to pre-configure model settings, provide aliases, and limit available models.

**Override default settings and create aliases:**
```ts
export const openai = customProvider({
  languageModels: {
    'gpt-5.1': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: { reasoningEffort: 'high' }
          }
        }
      })
    }),
    'gpt-5.1-high-reasoning': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: { reasoningEffort: 'high' }
          }
        }
      })
    })
  },
  fallbackProvider: gateway
});
```

**Create model name aliases for easy version updates:**
```ts
export const anthropic = customProvider({
  languageModels: {
    opus: gateway('anthropic/claude-opus-4.1'),
    sonnet: gateway('anthropic/claude-sonnet-4.5'),
    haiku: gateway('anthropic/claude-haiku-4.5')
  },
  fallbackProvider: gateway
});
```

**Limit available models across multiple providers:**
```ts
export const myProvider = customProvider({
  languageModels: {
    'text-medium': gateway('anthropic/claude-3-5-sonnet-20240620'),
    'text-small': gateway('openai/gpt-5-mini'),
    'reasoning-medium': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: { reasoningEffort: 'high' }
          }
        }
      })
    }),
    'reasoning-fast': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: { reasoningEffort: 'low' }
          }
        }
      })
    })
  },
  embeddingModels: {
    embedding: gateway.embeddingModel('openai/text-embedding-3-small')
  }
});
```

## Provider Registry

Create a provider registry using `createProviderRegistry()` to manage multiple providers and access them through simple string IDs with format `providerId:modelId`.

**Basic setup:**
```ts
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { createProviderRegistry, gateway } from 'ai';

export const registry = createProviderRegistry({
  gateway,
  anthropic,
  openai
});
```

**Custom separator (default is `:`)**:
```ts
export const customSeparatorRegistry = createProviderRegistry(
  {
    gateway,
    anthropic,
    openai
  },
  { separator: ' > ' }
);
```

**Access language models:**
```ts
const { text } = await generateText({
  model: registry.languageModel('openai:gpt-5.1'),
  prompt: 'Invent a new holiday and describe its traditions.'
});
```

**Access embedding models:**
```ts
const { embedding } = await embed({
  model: registry.embeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach'
});
```

**Access image models:**
```ts
const { image } = await generateImage({
  model: registry.imageModel('openai:dall-e-3'),
  prompt: 'A beautiful sunset over a calm ocean'
});
```

## Combined Example

Comprehensive setup combining custom providers, registry, and middleware:

```ts
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { xai } from '@ai-sdk/xai';
import { groq } from '@ai-sdk/groq';
import {
  createProviderRegistry,
  customProvider,
  defaultSettingsMiddleware,
  gateway,
  wrapLanguageModel
} from 'ai';

export const registry = createProviderRegistry(
  {
    gateway,
    xai,
    custom: createOpenAICompatible({
      name: 'provider-name',
      apiKey: process.env.CUSTOM_API_KEY,
      baseURL: 'https://api.custom.com/v1'
    }),
    anthropic: customProvider({
      languageModels: {
        fast: anthropic('claude-haiku-4-5'),
        writing: anthropic('claude-sonnet-4-5'),
        reasoning: wrapLanguageModel({
          model: anthropic('claude-sonnet-4-5'),
          middleware: defaultSettingsMiddleware({
            settings: {
              maxOutputTokens: 100000,
              providerOptions: {
                anthropic: {
                  thinking: {
                    type: 'enabled',
                    budgetTokens: 32000
                  }
                } satisfies AnthropicProviderOptions
              }
            }
          })
        })
      },
      fallbackProvider: anthropic
    }),
    groq: customProvider({
      languageModels: {
        'gemma2-9b-it': groq('gemma2-9b-it'),
        'qwen-qwq-32b': groq('qwen-qwq-32b')
      }
    })
  },
  { separator: ' > ' }
);

const model = registry.languageModel('anthropic > reasoning');
```

## Global Provider Configuration

By default, the global provider is set to the Vercel AI Gateway. Use plain model ID strings without provider prefix:

```ts
const result = await streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.'
});
```

Customize the global provider during startup:

```ts
import { openai } from '@ai-sdk/openai';

globalThis.AI_SDK_DEFAULT_PROVIDER = openai;
```

Then use models without prefix:

```ts
const result = await streamText({
  model: 'gpt-5.1',
  prompt: 'Invent a new holiday and describe its traditions.'
});
```

### error_handling
Error handling: try/catch for regular/simple-stream errors; switch on part.type for full-stream errors; onAbort callback or abort part type for stream aborts.

## Regular Errors
Regular errors thrown by the SDK are caught using try/catch blocks:
```ts
try {
  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
} catch (error) {
  // handle error
}
```

## Streaming Errors (Simple Streams)
Errors during streams without error chunk support are thrown as regular errors and caught with try/catch:
```ts
try {
  const { textStream } = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
} catch (error) {
  // handle error
}
```

## Streaming Errors (Full Streams with Error Support)
Full streams support error parts that can be handled within the stream iteration. Wrap with try/catch for errors outside the stream:
```ts
try {
  const { fullStream } = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
  for await (const part of fullStream) {
    switch (part.type) {
      case 'error': {
        const error = part.error;
        // handle error
        break;
      }
      case 'abort': {
        // handle stream abort
        break;
      }
      case 'tool-error': {
        const error = part.error;
        // handle error
        break;
      }
    }
  }
} catch (error) {
  // handle error
}
```

## Stream Aborts
When streams are aborted (e.g., via stop button), use the `onAbort` callback for cleanup operations. The `onAbort` callback is called on abort via AbortSignal but not on normal completion, while `onFinish` is called on normal completion:
```ts
const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  onAbort: ({ steps }) => {
    console.log('Stream aborted after', steps.length, 'steps');
  },
  onFinish: ({ steps, totalUsage }) => {
    console.log('Stream completed normally');
  },
});
for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

The `onAbort` callback receives `steps` - an array of all completed steps before abort. Alternatively, handle abort events directly in the stream by checking for `chunk.type === 'abort'` in the fullStream iteration.

### testing
Mock providers (MockLanguageModelV3, MockEmbeddingModelV3) and test helpers (mockId, mockValues, simulateReadableStream) for deterministic unit testing without calling real LLM providers.

## Testing Language Models

Testing language models is challenging due to their non-deterministic nature and the cost/slowness of calling real providers. The AI SDK Core provides mock providers and test helpers to enable unit testing.

### Available Test Utilities

Import from `ai/test`:
- **MockLanguageModelV3**: Mock language model following the v3 specification
- **MockEmbeddingModelV3**: Mock embedding model following the v3 specification
- **mockId**: Provides incrementing integer IDs
- **mockValues**: Iterates over an array of values, returning the last value when exhausted
- **simulateReadableStream**: Simulates readable streams with configurable delays

These allow you to control AI SDK output and test code deterministically without calling real providers.

### Usage Examples

**generateText**: Use MockLanguageModelV3 with a doGenerate function returning finishReason, usage stats, and text content:
```ts
const result = await generateText({
  model: new MockLanguageModelV3({
    doGenerate: async () => ({
      finishReason: 'stop',
      usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      content: [{ type: 'text', text: 'Hello, world!' }],
      warnings: [],
    }),
  }),
  prompt: 'Hello, test!',
});
```

**streamText**: Use MockLanguageModelV3 with a doStream function returning a simulated stream with text-start, text-delta, text-end, and finish chunks:
```ts
const result = streamText({
  model: new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'text-start', id: 'text-1' },
          { type: 'text-delta', id: 'text-1', delta: 'Hello' },
          { type: 'text-delta', id: 'text-1', delta: ', ' },
          { type: 'text-delta', id: 'text-1', delta: 'world!' },
          { type: 'text-end', id: 'text-1' },
          { type: 'finish', finishReason: 'stop', usage: { inputTokens: 3, outputTokens: 10, totalTokens: 13 } },
        ],
      }),
    }),
  }),
  prompt: 'Hello, test!',
});
```

**generateObject**: Use MockLanguageModelV3 with doGenerate returning JSON text matching your Zod schema:
```ts
const result = await generateObject({
  model: new MockLanguageModelV3({
    doGenerate: async () => ({
      finishReason: 'stop',
      usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      content: [{ type: 'text', text: '{"content":"Hello, world!"}' }],
      warnings: [],
    }),
  }),
  schema: z.object({ content: z.string() }),
  prompt: 'Hello, test!',
});
```

**streamObject**: Use MockLanguageModelV3 with doStream returning streamed JSON chunks:
```ts
const result = streamObject({
  model: new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'text-start', id: 'text-1' },
          { type: 'text-delta', id: 'text-1', delta: '{ ' },
          { type: 'text-delta', id: 'text-1', delta: '"content": ' },
          { type: 'text-delta', id: 'text-1', delta: '"Hello, world!"' },
          { type: 'text-delta', id: 'text-1', delta: ' }' },
          { type: 'text-end', id: 'text-1' },
          { type: 'finish', finishReason: 'stop', usage: { inputTokens: 3, outputTokens: 10, totalTokens: 13 } },
        ],
      }),
    }),
  }),
  schema: z.object({ content: z.string() }),
  prompt: 'Hello, test!',
});
```

**Simulate UI Message Stream Responses**: Use simulateReadableStream with initialDelayInMs and chunkDelayInMs to simulate server-sent event streams for testing or demonstration:
```ts
export async function POST(req: Request) {
  return new Response(
    simulateReadableStream({
      initialDelayInMs: 1000,
      chunkDelayInMs: 300,
      chunks: [
        `data: {"type":"start","messageId":"msg-123"}\n\n`,
        `data: {"type":"text-start","id":"text-1"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":"This"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":" is an"}\n\n`,
        `data: {"type":"text-delta","id":"text-1","delta":" example."}\n\n`,
        `data: {"type":"text-end","id":"text-1"}\n\n`,
        `data: {"type":"finish"}\n\n`,
        `data: [DONE]\n\n`,
      ],
    }).pipeThrough(new TextEncoderStream()),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'x-vercel-ai-ui-message-stream': 'v1',
      },
    },
  );
}
```

### telemetry
OpenTelemetry telemetry collection with per-function opt-in via `experimental_telemetry` option; configure with `isEnabled`, `functionId`, `metadata`, `recordInputs/Outputs`, or custom `tracer`; records nested spans for generateText/streamText/generateObject/streamObject/embed/embedMany with model, usage, headers, and semantic convention attributes.

## Overview
AI SDK uses OpenTelemetry to collect telemetry data. The feature is experimental and may change. Telemetry is disabled by default and must be explicitly enabled per function call.

## Enabling Telemetry
For Next.js applications, follow the Next.js OpenTelemetry guide first. Then use the `experimental_telemetry` option on specific function calls:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: { isEnabled: true },
});
```

Control input/output recording with `recordInputs` and `recordOutputs` (both enabled by default). Disable for privacy, data transfer, or performance reasons.

## Telemetry Metadata
Provide a `functionId` to identify the function and `metadata` for additional information:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'my-awesome-function',
    metadata: {
      something: 'custom',
      someOtherThing: 'other-value',
    },
  },
});
```

## Custom Tracer
Provide a custom OpenTelemetry `Tracer` to use a `TracerProvider` other than the singleton:

```ts
const tracerProvider = new NodeTracerProvider();
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    tracer: tracerProvider.getTracer('ai'),
  },
});
```

## Collected Data

### generateText
Records 3 span types:
- `ai.generateText`: full call span with attributes `operation.name`, `ai.operationId`, `ai.prompt`, `ai.response.text`, `ai.response.toolCalls`, `ai.response.finishReason`, `ai.settings.maxOutputTokens`
- `ai.generateText.doGenerate`: provider call span with `ai.prompt.messages`, `ai.prompt.tools` (stringified array), `ai.prompt.toolChoice` (stringified JSON with `type` and optional `toolName`), `ai.response.text`, `ai.response.toolCalls`, `ai.response.finishReason`
- `ai.toolCall`: tool call span (see Tool call spans section)

### streamText
Records 3 span types and 2 event types:
- `ai.streamText`: full call span with `ai.prompt`, `ai.response.text`, `ai.response.toolCalls`, `ai.response.finishReason`, `ai.settings.maxOutputTokens`
- `ai.streamText.doStream`: provider call span with `ai.prompt.messages`, `ai.prompt.tools`, `ai.prompt.toolChoice`, `ai.response.text`, `ai.response.toolCalls`, `ai.response.msToFirstChunk`, `ai.response.msToFinish`, `ai.response.avgCompletionTokensPerSecond`, `ai.response.finishReason`
- `ai.toolCall`: tool call span
- `ai.stream.firstChunk` event: emitted when first chunk received, contains `ai.response.msToFirstChunk`
- `ai.stream.finish` event: emitted when finish part received

### generateObject
Records 2 span types:
- `ai.generateObject`: full call span with `ai.prompt`, `ai.schema` (stringified JSON schema), `ai.schema.name`, `ai.schema.description`, `ai.response.object` (stringified JSON), `ai.settings.output`
- `ai.generateObject.doGenerate`: provider call span with `ai.prompt.messages`, `ai.response.object`, `ai.response.finishReason`

### streamObject
Records 2 span types and 1 event type:
- `ai.streamObject`: full call span with `ai.prompt`, `ai.schema` (stringified), `ai.schema.name`, `ai.schema.description`, `ai.response.object` (stringified), `ai.settings.output`
- `ai.streamObject.doStream`: provider call span with `ai.prompt.messages`, `ai.response.object`, `ai.response.msToFirstChunk`, `ai.response.finishReason`
- `ai.stream.firstChunk` event: contains `ai.response.msToFirstChunk`

### embed
Records 2 span types:
- `ai.embed`: full call span with `ai.value`, `ai.embedding` (JSON-stringified)
- `ai.embed.doEmbed`: provider call span with `ai.values` (array), `ai.embeddings` (array of JSON-stringified embeddings)

### embedMany
Records 2 span types:
- `ai.embedMany`: full call span with `ai.values`, `ai.embeddings` (array of JSON-stringified embeddings)
- `ai.embedMany.doEmbed`: provider call span with `ai.values`, `ai.embeddings` (array of JSON-stringified embeddings)

## Span Details

### Basic LLM span information
Spans for `ai.generateText`, `ai.generateText.doGenerate`, `ai.streamText`, `ai.streamText.doStream`, `ai.generateObject`, `ai.generateObject.doGenerate`, `ai.streamObject`, `ai.streamObject.doStream` contain:
- `resource.name`: functionId
- `ai.model.id`: model id
- `ai.model.provider`: provider name
- `ai.request.headers.*`: request headers
- `ai.response.providerMetadata`: provider-specific metadata
- `ai.settings.maxRetries`: max retries
- `ai.telemetry.functionId`: functionId
- `ai.telemetry.metadata.*`: custom metadata
- `ai.usage.completionTokens`: completion token count
- `ai.usage.promptTokens`: prompt token count

### Call LLM span information
Spans for individual LLM calls (`ai.generateText.doGenerate`, `ai.streamText.doStream`, `ai.generateObject.doGenerate`, `ai.streamObject.doStream`) contain basic LLM span information plus:
- `ai.response.model`: actual model used (may differ from requested if provider supports aliases)
- `ai.response.id`: response id from provider
- `ai.response.timestamp`: response timestamp from provider
- OpenTelemetry GenAI semantic conventions: `gen_ai.system`, `gen_ai.request.model`, `gen_ai.request.temperature`, `gen_ai.request.max_tokens`, `gen_ai.request.frequency_penalty`, `gen_ai.request.presence_penalty`, `gen_ai.request.top_k`, `gen_ai.request.top_p`, `gen_ai.request.stop_sequences`, `gen_ai.response.finish_reasons`, `gen_ai.response.model`, `gen_ai.response.id`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`

### Basic embedding span information
Spans for `ai.embed`, `ai.embed.doEmbed`, `ai.embedMany`, `ai.embedMany.doEmbed` contain:
- `ai.model.id`: model id
- `ai.model.provider`: provider name
- `ai.request.headers.*`: request headers
- `ai.settings.maxRetries`: max retries
- `ai.telemetry.functionId`: functionId
- `ai.telemetry.metadata.*`: custom metadata
- `ai.usage.tokens`: token count
- `resource.name`: functionId

### Tool call spans
`ai.toolCall` spans contain:
- `operation.name`: `"ai.toolCall"`
- `ai.operationId`: `"ai.toolCall"`
- `ai.toolCall.name`: tool name
- `ai.toolCall.id`: tool call id
- `ai.toolCall.args`: input parameters
- `ai.toolCall.result`: output result (only if successful and serializable)

