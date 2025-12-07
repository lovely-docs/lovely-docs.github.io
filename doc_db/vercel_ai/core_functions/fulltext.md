

## Pages

### overview
Standardized LLM integration with four core functions: generateText, streamText, generateObject, streamObject for text and structured data generation in interactive and non-interactive contexts.

## AI SDK Core

AI SDK Core simplifies working with Large Language Models (LLMs) by providing a standardized interface for integrating them into applications, allowing developers to focus on building AI features rather than handling technical details.

### Core Functions

**Text Generation:**
- `generateText`: Generates text and tool calls for non-interactive use cases like automation, email drafting, web page summarization, and agents using tools.
- `streamText`: Streams text and tool calls for interactive use cases like chatbots and content streaming.

**Structured Data Generation:**
- `generateObject`: Generates typed, structured objects matching a Zod schema. Use for information extraction, synthetic data generation, or classification tasks.
- `streamObject`: Streams structured objects matching a Zod schema. Use for streaming generated UIs.

All functions use standardized approaches for setting up prompts and settings, making it easier to work with different models.

### generating-text
generateText for complete text generation, streamText for streaming with backpressure; both support callbacks (onFinish, onError, onChunk), fullStream for all events, experimental_transform for stream filtering/smoothing, sources from some providers.

## Text Generation Functions

The AI SDK Core provides two main functions for generating text from LLMs:

### `generateText`
Generates complete text for a given prompt and model. Ideal for non-interactive use cases (drafting emails, summarizing documents) and agents using tools.

```ts
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});

// With system prompt
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You are a professional writer. You write simple, clear, and concise content.',
  prompt: `Summarize the following article in 3-5 sentences: ${article}`,
});
```

Result object properties: `content`, `text`, `reasoning`, `reasoningText`, `files`, `sources`, `toolCalls`, `toolResults`, `finishReason`, `usage`, `totalUsage`, `warnings`, `request`, `response`, `providerMetadata`, `steps`, `output`.

Access response headers and body via `result.response.headers` and `result.response.body`.

`onFinish` callback triggered after completion with text, usage, finish reason, messages, steps, total usage:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
    // save chat history, record usage, etc.
    const messages = response.messages;
  },
});
```

### `streamText`
Streams text from LLMs for interactive use cases (chatbots, real-time applications). Starts immediately and suppresses errors to prevent crashes.

```ts
import { streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

// textStream is both ReadableStream and AsyncIterable
for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

Helper functions: `toUIMessageStreamResponse()`, `pipeUIMessageStreamToResponse()`, `toTextStreamResponse()`, `pipeTextStreamToResponse()`.

Result promises (resolve when stream finishes): `content`, `text`, `reasoning`, `reasoningText`, `files`, `sources`, `toolCalls`, `toolResults`, `finishReason`, `usage`, `totalUsage`, `warnings`, `steps`, `request`, `response`, `providerMetadata`.

Uses backpressure—only generates tokens as requested. Must consume stream for it to finish.

`onError` callback for error logging (errors become part of stream, not thrown):
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error);
  },
});
```

`onChunk` callback triggered for each stream chunk (types: `text`, `reasoning`, `source`, `tool-call`, `tool-input-start`, `tool-input-delta`, `tool-result`, `raw`):
```ts
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

`onFinish` callback when stream completes:
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
    // save chat history, record usage, etc.
    const messages = response.messages;
  },
});
```

### `fullStream` Property
Read all stream events with `result.fullStream`. Event types: `start`, `start-step`, `text-start`, `text-delta`, `text-end`, `reasoning-start`, `reasoning-delta`, `reasoning-end`, `source`, `file`, `tool-call`, `tool-input-start`, `tool-input-delta`, `tool-input-end`, `tool-result`, `tool-error`, `finish-step`, `finish`, `error`, `raw`.

```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    cityAttractions: {
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({
        attractions: ['attraction1', 'attraction2', 'attraction3'],
      }),
    },
  },
  prompt: 'What are some San Francisco tourist attractions?',
});

for await (const part of result.fullStream) {
  switch (part.type) {
    case 'text-delta': {
      // handle text delta
      break;
    }
    case 'tool-call': {
      switch (part.toolName) {
        case 'cityAttractions': {
          // handle tool call
          break;
        }
      }
      break;
    }
    case 'tool-result': {
      switch (part.toolName) {
        case 'cityAttractions': {
          // handle tool result
          break;
        }
      }
      break;
    }
    // ... other cases
  }
}
```

### Stream Transformation
Use `experimental_transform` option to filter, change, or smooth text streams. Transformations applied before callbacks and promise resolution.

`smoothStream` function available for smoothing text streaming:
```ts
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```

Custom transformations receive tools and return a TransformStream:
```ts
const upperCaseTransform =
  <TOOLS extends ToolSet>() =>
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

Stop stream using `stopStream()` function. Must simulate `finish-step` and `finish` events to ensure well-formed stream and callback invocation:
```ts
const stopWordTransform =
  <TOOLS extends ToolSet>() =>
  ({ stopStream }: { stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        if (chunk.type !== 'text') {
          controller.enqueue(chunk);
          return;
        }

        if (chunk.text.includes('STOP')) {
          stopStream();
          controller.enqueue({
            type: 'finish-step',
            finishReason: 'stop',
            logprobs: undefined,
            usage: { completionTokens: NaN, promptTokens: NaN, totalTokens: NaN },
            request: {},
            response: { id: 'response-id', modelId: 'mock-model-id', timestamp: new Date(0) },
            warnings: [],
            isContinued: false,
          });
          controller.enqueue({
            type: 'finish',
            finishReason: 'stop',
            logprobs: undefined,
            usage: { completionTokens: NaN, promptTokens: NaN, totalTokens: NaN },
            response: { id: 'response-id', modelId: 'mock-model-id', timestamp: new Date(0) },
          });
          return;
        }

        controller.enqueue(chunk);
      },
    });
```

Multiple transformations applied in order:
```ts
const result = streamText({
  model,
  prompt,
  experimental_transform: [firstTransform, secondTransform],
});
```

### Sources
Some providers (Perplexity, Google Generative AI) include sources in responses. Currently limited to web pages grounding the response.

Source properties: `id`, `url`, `title` (optional), `providerMetadata`.

With `generateText`:
```ts
const result = await generateText({
  model: 'google/gemini-2.5-flash',
  tools: {
    google_search: google.tools.googleSearch({}),
  },
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

With `streamText` via `fullStream`:
```ts
const result = streamText({
  model: 'google/gemini-2.5-flash',
  tools: {
    google_search: google.tools.googleSearch({}),
  },
  prompt: 'List the top 5 San Francisco news from the past week.',
});

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

### generating-structured-data
generateObject/streamObject for schema-validated structured data generation with Zod/Valibot/JSON; supports object/array/enum/no-schema outputs, error handling, JSON repair, and integration with generateText/streamText via Output types.

## Generating Structured Data

The AI SDK provides `generateObject` and `streamObject` functions to standardize structured data generation across model providers. Both support different output strategies (`array`, `object`, `enum`, `no-schema`) and generation modes (`auto`, `tool`, `json`). Schemas can be defined using Zod, Valibot, or JSON schemas.

### generateObject

Generates structured data from a prompt with schema validation:

```ts
import { generateObject } from 'ai';
import { z } from 'zod';

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

Access response headers and body via `result.response.headers` and `result.response.body`.

### streamObject

Streams the model's response as it's generated for better interactivity:

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

Errors are part of the stream; use `onError` callback for logging.

### Output Strategies

**Object** (default): Returns generated data as an object.

**Array**: Generate array of objects; schema specifies element shape. With `streamObject`, use `elementStream`:

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

**Enum**: Generate specific enum value for classification (generateObject only):

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole in search of a new habitable planet for humanity."',
});
```

**No Schema**: Omit schema for dynamic user requests:

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

### Schema Configuration

Optionally specify `schemaName` and `schemaDescription` for additional LLM guidance:

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schemaName: 'Recipe',
  schemaDescription: 'A recipe for a dish.',
  schema: z.object({
    name: z.string(),
    ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

### Accessing Reasoning

Access model reasoning via `result.reasoning` (if available):

```ts
import { OpenAIResponsesProviderOptions } from '@ai-sdk/openai';

const result = await generateObject({
  model: 'openai/gpt-5',
  schema: z.object({ /* ... */ }),
  prompt: 'Generate a lasagna recipe.',
  providerOptions: {
    openai: {
      strictJsonSchema: true,
      reasoningSummary: 'detailed',
    } satisfies OpenAIResponsesProviderOptions,
  },
});

console.log(result.reasoning);
```

### Error Handling

`generateObject` throws `AI_NoObjectGeneratedError` when it cannot generate a valid object. The error preserves:
- `text`: Generated text (raw or tool call)
- `response`: Metadata (id, timestamp, model)
- `usage`: Token usage
- `cause`: Underlying error (JSON parsing, validation, etc.)

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

### Repairing Invalid JSON

Experimental `experimental_repairText` function attempts to repair malformed JSON:

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

### Structured Outputs with generateText and streamText

Use `output` setting with `generateText` and `streamText` for structured data generation.

**generateText**:

```ts
const { output } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
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

**streamText**:

```ts
const { partialOutputStream } = await streamText({
  model: 'anthropic/claude-sonnet-4.5',
  output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable(),
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

### Output Types

**Output.text()**: Generate plain text without schema enforcement:

```ts
const { output } = await generateText({
  output: Output.text(),
  prompt: 'Tell me a joke.',
});
// output is a string
```

**Output.object()**: Generate structured object with schema validation:

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
// output matches schema; partial outputs also validated
```

**Output.array()**: Generate array of typed objects:

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
// output: [
//   { location: 'San Francisco', temperature: 70, condition: 'Sunny' },
//   { location: 'Paris', temperature: 65, condition: 'Cloudy' },
// ]
```

**Output.choice()**: Choose from specific string options for classification:

```ts
const { output } = await generateText({
  output: Output.choice({
    options: ['sunny', 'rainy', 'snowy'],
  }),
  prompt: 'Is the weather sunny, rainy, or snowy today?',
});
// output is one of: 'sunny', 'rainy', or 'snowy'
```

**Output.json()**: Generate and parse unstructured JSON without schema validation:

```ts
const { output } = await generateText({
  output: Output.json(),
  prompt: 'For each city, return the current temperature and weather condition as a JSON object.',
});
// output could be any valid JSON, e.g.:
// {
//   "San Francisco": { "temperature": 70, "condition": "Sunny" },
//   "Paris": { "temperature": 65, "condition": "Cloudy" }
// }
```

### tool-calling
Tool calling: define tools with description, inputSchema, execute; multi-step calls with stopWhen; callbacks (onStepFinish, prepareStep); dynamic tools; tool choice control; error handling; experimental repair; active tools filtering; multi-modal results; type helpers; MCP support.

## Tool Calling

Tools are objects that models can call to perform specific tasks. Each tool has:
- `description`: Optional description influencing tool selection
- `inputSchema`: Zod or JSON schema defining input parameters, validated by LLM
- `execute`: Optional async function receiving validated inputs, returns a value

Tools are passed as an object with tool names as keys:

```ts
import { z } from 'zod';
import { generateText, tool } from 'ai';

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

With `stopWhen`, models can generate multiple tool calls and text responses in sequence. Each generation (tool call or text) is a step. The SDK automatically triggers new generations passing tool results until no further tool calls occur or the stopping condition is met.

```ts
import { generateText, tool, stepCountIs } from 'ai';

const { text, steps } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { /* ... */ },
  stopWhen: stepCountIs(5), // max 5 steps
  prompt: 'What is the weather in San Francisco?',
});

// Extract tool calls from all steps
const allToolCalls = steps.flatMap(step => step.toolCalls);
```

### Callbacks

**`onStepFinish`**: Triggered when a step completes with text, tool calls, tool results, and finish reason:
```ts
onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
  // save chat history, record usage, etc.
}
```

**`prepareStep`**: Called before each step starts. Receives `model`, `stopWhen`, `stepNumber`, `steps`, `messages`. Can return modified settings:
```ts
prepareStep: async ({ model, stepNumber, steps, messages }) => {
  if (stepNumber === 0) {
    return {
      model: differentModel,
      toolChoice: { type: 'tool', toolName: 'tool1' },
      activeTools: ['tool1'],
    };
  }
  // For longer loops, compress messages:
  if (messages.length > 20) {
    return { messages: messages.slice(-10) };
  }
}
```

### Response Messages

Both `generateText` and `streamText` return `response.messages` containing assistant and tool messages to add to conversation history:

```ts
const messages: ModelMessage[] = [/* ... */];
const { response } = await generateText({ /* ... */, messages });
messages.push(...response.messages);
```

## Dynamic Tools

For tools with unknown schemas at compile time (MCP tools, user-defined functions, external sources), use `dynamicTool`:

```ts
import { dynamicTool } from 'ai';

const customTool = dynamicTool({
  description: 'Execute a custom function',
  inputSchema: z.object({}),
  execute: async input => {
    const { action, parameters } = input as any;
    return { result: `Executed ${action}` };
  },
});
```

Type-safe handling with `dynamic` flag:
```ts
onStepFinish: ({ toolCalls }) => {
  for (const toolCall of toolCalls) {
    if (toolCall.dynamic) {
      console.log('Dynamic:', toolCall.toolName, toolCall.input); // input is 'unknown'
    } else {
      switch (toolCall.toolName) {
        case 'weather':
          console.log(toolCall.input.location); // typed as string
      }
    }
  }
}
```

## Preliminary Tool Results

Return `AsyncIterable` from `execute` to stream multiple results. Last value is final result:

```ts
tool({
  description: 'Get the current weather.',
  inputSchema: z.object({ location: z.string() }),
  async *execute({ location }) {
    yield { status: 'loading', text: `Getting weather for ${location}` };
    await new Promise(resolve => setTimeout(resolve, 3000));
    const temperature = 72 + Math.floor(Math.random() * 21) - 10;
    yield { status: 'success', text: `The weather in ${location} is ${temperature}°F`, temperature };
  },
})
```

## Tool Choice

Control when tools are selected via `toolChoice`:
- `auto` (default): Model chooses whether and which tools to call
- `required`: Model must call a tool
- `none`: Model must not call tools
- `{ type: 'tool', toolName: string }`: Model must call specific tool

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { /* ... */ },
  toolChoice: 'required',
  prompt: 'What is the weather in San Francisco?',
});
```

## Tool Execution Options

Tools receive a second parameter with execution options:

**Tool Call ID**: Forward tool-call-related information:
```ts
execute: async (args, { toolCallId }) => {
  writer.write({
    type: 'data-tool-status',
    id: toolCallId,
    data: { name: 'myTool', status: 'in-progress' },
  });
}
```

**Messages**: Access message history from all previous steps:
```ts
execute: async (args, { messages }) => {
  // use message history in calls to other language models
}
```

**Abort Signals**: Forward abort signals for cancellation:
```ts
execute: async ({ location }, { abortSignal }) => {
  return fetch(`https://api.weatherapi.com/v1/current.json?q=${location}`, { signal: abortSignal });
}
```

**Context (experimental)**: Pass arbitrary context:
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

Available in `streamText` only:
- `onInputStart`: When model starts generating input
- `onInputDelta`: For each chunk of streamed input
- `onInputAvailable`: When complete input is available and validated

```ts
tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({ location: z.string() }),
  execute: async ({ location }) => ({ temperature: 72 + Math.floor(Math.random() * 21) - 10 }),
  onInputStart: () => console.log('Tool call starting'),
  onInputDelta: ({ inputTextDelta }) => console.log('Received input chunk:', inputTextDelta),
  onInputAvailable: ({ input }) => console.log('Complete input:', input),
})
```

## Types

Use helper types for type-safe tool definitions outside `generateText`/`streamText`:

```ts
import { TypedToolCall, TypedToolResult, generateText, tool } from 'ai';

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
- `InvalidToolInputError`: Tool inputs don't match schema
- `ToolCallRepairError`: Error during tool call repair

```ts
try {
  const result = await generateText({ /* ... */ });
} catch (error) {
  if (NoSuchToolError.isInstance(error)) {
    // handle
  } else if (InvalidToolInputError.isInstance(error)) {
    // handle
  }
}
```

Tool execution errors appear as `tool-error` parts in result steps:
```ts
const { steps } = await generateText({ /* ... */ });
const toolErrors = steps.flatMap(step =>
  step.content.filter(part => part.type === 'tool-error'),
);
toolErrors.forEach(toolError => {
  console.log('Tool error:', toolError.error, toolError.toolName, toolError.input);
});
```

For `streamText`, use `toUIMessageStreamResponse` with `onError`:
```ts
result.toUIMessageStreamResponse({
  onError: error => {
    if (NoSuchToolError.isInstance(error)) return 'Unknown tool.';
    if (InvalidToolInputError.isInstance(error)) return 'Invalid inputs.';
    return 'Unknown error.';
  },
});
```

## Tool Call Repair (experimental)

Use `experimental_repairToolCall` to fix invalid tool calls without additional steps:

```ts
const result = await generateText({
  model,
  tools,
  prompt,
  experimental_repairToolCall: async ({ toolCall, tools, inputSchema, error }) => {
    if (NoSuchToolError.isInstance(error)) return null;
    
    const tool = tools[toolCall.toolName as keyof typeof tools];
    const { object: repairedArgs } = await generateObject({
      model: 'anthropic/claude-sonnet-4.5',
      schema: tool.inputSchema,
      prompt: `Fix the tool call "${toolCall.toolName}" with inputs: ${JSON.stringify(toolCall.input)}`,
    });
    return { ...toolCall, input: JSON.stringify(repairedArgs) };
  },
});
```

Re-ask strategy:
```ts
experimental_repairToolCall: async ({ toolCall, tools, error, messages, system }) => {
  const result = await generateText({
    model,
    system,
    messages: [
      ...messages,
      { role: 'assistant', content: [{ type: 'tool-call', toolCallId: toolCall.toolCallId, toolName: toolCall.toolName, input: toolCall.input }] },
      { role: 'tool', content: [{ type: 'tool-result', toolCallId: toolCall.toolCallId, toolName: toolCall.toolName, output: error.message }] },
    ],
    tools,
  });
  const newToolCall = result.toolCalls.find(tc => tc.toolName === toolCall.toolName);
  return newToolCall ? { toolCallType: 'function', toolCallId: toolCall.toolCallId, toolName: toolCall.toolName, input: JSON.stringify(newToolCall.input) } : null;
}
```

## Active Tools

Limit available tools to model while maintaining static typing:

```ts
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: myToolSet,
  activeTools: ['firstTool'],
});
```

## Multi-modal Tool Results (experimental)

Supported by Anthropic and OpenAI. Use optional `toModelOutput` function to convert tool results to content parts:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    computer: anthropic.tools.computer_20241022({
      async execute({ action, coordinate, text }) {
        switch (action) {
          case 'screenshot':
            return { type: 'image', data: fs.readFileSync('./data/screenshot-editor.png').toString('base64') };
          default:
            return `executed ${action}`;
        }
      },
      toModelOutput(result) {
        return {
          type: 'content',
          value: typeof result === 'string'
            ? [{ type: 'text', text: result }]
            : [{ type: 'media', data: result.data, mediaType: 'image/png' }],
        };
      },
    }),
  },
});
```

## Extracting Tools

Use `tool` helper for correct type inference when extracting to separate files:

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

AI SDK supports Model Context Protocol servers for standardized tool access. See MCP Tools documentation for details.

**AI SDK Tools vs MCP Tools**:
| Aspect | AI SDK Tools | MCP Tools |
|--------|-------------|-----------|
| Type Safety | Full static typing | Dynamic discovery |
| Execution | Same process (low latency) | Separate server (network overhead) |
| Prompt Control | Full control | Controlled by MCP server |
| Schema Control | You define | Controlled by MCP server |
| Version Management | Full visibility | Independent updates (version skew risk) |
| Authentication | Same process | Separate server auth |
| Best For | Production (control/performance) | Development (user-provided tools) |


### mcp-tools
Connect to Model Context Protocol servers to access tools, resources, and prompts; supports HTTP/SSE/stdio transports, schema discovery or explicit definitions, resource/prompt access, and elicitation request handling.

## Model Context Protocol (MCP) Tools

Connect to MCP servers to access their tools, resources, and prompts through a standardized interface.

### Initializing an MCP Client

Three transport options available:

**HTTP Transport (Recommended for production)**
```typescript
import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';

const mcpClient = await createMCPClient({
  transport: {
    type: 'http',
    url: 'https://your-server.com/mcp',
    headers: { Authorization: 'Bearer my-api-key' },
    authProvider: myOAuthClientProvider, // optional
  },
});
```

Or using MCP's official SDK:
```typescript
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const mcpClient = await createMCPClient({
  transport: new StreamableHTTPClientTransport(
    new URL('https://your-server.com/mcp'),
    { sessionId: 'session_123' }
  ),
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

**Stdio Transport (Local servers only)**
```typescript
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const mcpClient = await createMCPClient({
  transport: new StdioClientTransport({
    command: 'node',
    args: ['src/stdio/dist/server.js'],
  }),
});
```

You can also implement custom transport via `MCPTransport` interface.

### Closing the MCP Client

For short-lived usage, close when response finishes:
```typescript
const result = await streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: await mcpClient.tools(),
  prompt: 'What is the weather in Brooklyn, New York?',
  onFinish: async () => {
    await mcpClient.close();
  },
});
```

For long-running clients, use try/finally:
```typescript
let mcpClient: MCPClient | undefined;
try {
  mcpClient = await experimental_createMCPClient({ /* ... */ });
} finally {
  await mcpClient?.close();
}
```

### Using MCP Tools

**Schema Discovery** - Automatically list all server tools:
```typescript
const tools = await mcpClient.tools();
```

**Schema Definition** - Explicit type-safe tool definitions:
```typescript
import { z } from 'zod';

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

### Using MCP Resources

Resources are application-driven data sources providing context to the model.

```typescript
// List all resources
const resources = await mcpClient.listResources();

// Read specific resource by URI
const resourceData = await mcpClient.readResource({
  uri: 'file:///example/document.txt',
});

// List resource templates (dynamic URI patterns)
const templates = await mcpClient.listResourceTemplates();
```

### Using MCP Prompts

Prompts are user-controlled templates servers expose.

```typescript
// List all prompts
const prompts = await mcpClient.listPrompts();

// Get prompt with optional arguments
const prompt = await mcpClient.getPrompt({
  name: 'code_review',
  arguments: { code: 'function add(a, b) { return a + b; }' },
});
```

### Handling Elicitation Requests

Elicitation allows MCP servers to request additional information from the client during tool execution.

Enable elicitation capability:
```typescript
const mcpClient = await experimental_createMCPClient({
  transport: { type: 'sse', url: 'https://your-server.com/sse' },
  capabilities: { elicitation: {} },
});
```

Register handler:
```typescript
import { ElicitationRequestSchema } from '@ai-sdk/mcp';

mcpClient.onElicitationRequest(ElicitationRequestSchema, async request => {
  // request.params.message: description of needed input
  // request.params.requestedSchema: JSON schema for expected input

  const userInput = await getInputFromUser(
    request.params.message,
    request.params.requestedSchema,
  );

  return {
    action: 'accept', // or 'decline' or 'cancel'
    content: userInput, // required for 'accept'
  };
});
```

**Note:** The lightweight MCP client from `experimental_createMCPClient` doesn't support session management, resumable streams, or notifications. OAuth authorization is supported via `authProvider` on HTTP/SSE transports.

### prompt-engineering
Best practices for tool-calling prompts, Zod schema patterns (dates, optional params, temperature), and debugging via warnings and request inspection.

## Tips for Prompts with Tools

When creating prompts that include tools, follow these best practices:

1. Use strong tool-calling models like `gpt-4` or `gpt-4.1`; weaker models struggle with tool calls
2. Keep tool count low (≤5) and parameter complexity minimal
3. Use semantically meaningful names for tools, parameters, and properties
4. Add `.describe("...")` to Zod schema properties to hint at their purpose
5. Document tool output in the `description` field when outputs are unclear or tools have dependencies
6. Include JSON example input/outputs of tool calls in prompts to teach the model how to use them

## Tool & Structured Data Schemas

Zod-to-LLM schema mapping isn't always straightforward.

**Zod Dates**: Models return dates as strings, not JavaScript Date objects. Use `z.string().datetime()` or `z.string().date()` with a transformer:

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

**Optional Parameters**: Some providers with strict schema validation (e.g., OpenAI structured outputs) fail with `.optional()`. Use `.nullable()` instead:

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
Common settings for AI SDK functions: output control (maxOutputTokens, temperature/topP/topK, stopSequences, seed), penalties (presencePenalty, frequencyPenalty), request control (maxRetries, abortSignal for timeout/cancellation, headers for HTTP requests).

## Common Settings

All AI SDK functions support these settings alongside model and prompt:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  maxOutputTokens: 512,
  temperature: 0.3,
  maxRetries: 5,
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Note:** Some providers don't support all settings; check the `warnings` property in results.

## Output Control

- **`maxOutputTokens`**: Maximum tokens to generate.
- **`temperature`**: Controls randomness (0 = deterministic, higher = more random). Range depends on provider. Don't set both `temperature` and `topP`.
- **`topP`**: Nucleus sampling (typically 0-1, e.g., 0.1 = top 10% probability mass). Don't set both `temperature` and `topP`.
- **`topK`**: Sample only from top K options per token. Removes low-probability responses; for advanced use only.
- **`stopSequences`**: Array of sequences that stop generation when encountered. Providers may limit count.
- **`seed`**: Integer seed for deterministic results if supported by model.

## Penalties

- **`presencePenalty`**: Reduces likelihood of repeating information already in prompt (0 = no penalty).
- **`frequencyPenalty`**: Reduces likelihood of reusing same words/phrases (0 = no penalty).

## Request Control

- **`maxRetries`**: Maximum retry attempts. Default: 2. Set to 0 to disable.
- **`abortSignal`**: Cancel calls or set timeout:
  ```ts
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Invent a new holiday and describe its traditions.',
    abortSignal: AbortSignal.timeout(5000), // 5 seconds
  });
  ```

- **`headers`**: Additional HTTP headers for HTTP-based providers:
  ```ts
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Invent a new holiday and describe its traditions.',
    headers: { 'Prompt-Id': 'my-prompt-id' },
  });
  ```
  Can also set headers in provider configuration for all requests.

### embeddings
Embed text to vectors with `embed()` or `embedMany()`, calculate similarity with `cosineSimilarity()`, supports OpenAI/Google/Mistral/Cohere/Bedrock with configurable parallelism, retries, timeouts, headers, and provider options.

## Embeddings

Embeddings represent words, phrases, or images as vectors in high-dimensional space where similar items are close together.

### Single Value Embedding

```ts
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

### Batch Embedding

```ts
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```

### Similarity Calculation

```ts
import { cosineSimilarity, embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});

console.log(`cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`);
```

### Token Usage

```ts
const { embedding, usage } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
console.log(usage); // { tokens: 10 }
```

### Configuration Options

**Provider Options** - Pass provider-specific settings via `providerOptions`:
```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  providerOptions: {
    openai: { dimensions: 512 },
  },
});
```

**Parallel Requests** - Control concurrency with `maxParallelCalls`:
```ts
const { embeddings } = await embedMany({
  maxParallelCalls: 2,
  model: 'openai/text-embedding-3-small',
  values: ['...', '...', '...'],
});
```

**Retries** - Set `maxRetries` (defaults to 2):
```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  maxRetries: 0,
});
```

**Abort Signals & Timeouts**:
```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  abortSignal: AbortSignal.timeout(1000),
});
```

**Custom Headers**:
```ts
const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### Response Information

Both `embed` and `embedMany` return a `response` property with raw provider response:
```ts
const { embedding, response } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

### Embedding Middleware

Wrap embedding models with middleware to set defaults:
```ts
import { wrapEmbeddingModel, defaultEmbeddingSettingsMiddleware, gateway } from 'ai';

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

### Available Embedding Models

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
Rerank documents by query relevance using `rerank()` with trained models; returns ranking array with originalIndex, score (0-1), and document; supports string/JSON documents, topN limiting, retries, abort signals, custom headers, and provider-specific options; available from Cohere, Bedrock, Together.ai.

## Reranking

Reranking improves search relevance by reordering documents based on their relevance to a query. Unlike embedding-based similarity search, reranking models are specifically trained to understand query-document relationships and produce more accurate relevance scores.

### Basic Usage

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

// ranking: [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day at the beach' }
// ]
```

### Structured Documents

Reranking supports JSON objects for searching databases, emails, or structured content:

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

// rerankedDocuments[0]: { from: 'John McGill', subject: 'Missing Info', text: '...' }
```

### Result Structure

The `rerank` function returns:
- `ranking`: sorted array of `{ originalIndex, score, document }`
- `rerankedDocuments`: documents sorted by relevance
- `originalDocuments`: original documents array
- `response`: raw provider response with `{ id, timestamp, modelId, headers, body }`

Each ranking item contains:
- `originalIndex`: position in original array
- `score`: relevance score (typically 0-1, higher is more relevant)
- `document`: the original document

### Configuration

**Top-N Results**: Limit returned results with `topN` parameter:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'],
  query: 'relevant information',
  topN: 3,
});
```

**Provider Options**: Configure provider-specific parameters:
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

**Retries**: Set `maxRetries` (defaults to 2, meaning 3 total attempts):
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  maxRetries: 0,
});
```

**Abort Signal & Timeout**: Use `abortSignal` to abort or timeout:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  abortSignal: AbortSignal.timeout(5000),
});
```

**Custom Headers**: Add custom headers with `headers` parameter:
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### Supported Providers & Models

| Provider | Model |
| --- | --- |
| Cohere | `rerank-v3.5`, `rerank-english-v3.0`, `rerank-multilingual-v3.0` |
| Amazon Bedrock | `amazon.rerank-v1:0`, `cohere.rerank-v3-5:0` |
| Together.ai | `Salesforce/Llama-Rank-v1`, `mixedbread-ai/Mxbai-Rerank-Large-V2` |

### image_generation
Generate images from text prompts using `generateImage()` with configurable size/aspect ratio, batch generation, seeds, provider-specific options, error handling, and support for 10+ providers.

## Overview
The `generateImage` function generates images from text prompts using image models from various providers (OpenAI, Google Vertex, Fal, etc.).

## Basic Usage
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

## Size and Aspect Ratio
Specify size as `{width}x{height}` (e.g., `'1024x1024'`) or aspect ratio as `{width}:{height}` (e.g., `'16:9'`). Supported values vary by model and provider.

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

## Multiple Images
Use the `n` parameter to generate multiple images. The SDK automatically batches requests based on model limits (e.g., DALL-E 3 generates 1 per call, DALL-E 2 up to 10). Override with `maxImagesPerCall`:

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

## Seed
Provide a seed to control reproducibility (if supported by model):

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  seed: 1234567890,
});
```

## Provider-Specific Settings
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

## Abort Signals and Timeouts
Use `abortSignal` to abort or timeout requests:

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  abortSignal: AbortSignal.timeout(1000),
});
```

## Custom Headers
Add custom headers via the `headers` parameter:

```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

## Warnings and Metadata
Access warnings and provider-specific metadata:

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

## Error Handling
Catch `AI_NoImageGeneratedError` when generation fails:

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

## Language Models with Image Output
Some language models (e.g., `gemini-2.5-flash-image-preview`) support multi-modal outputs. Access generated images via the `files` property:

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

## Supported Image Models
Comprehensive table of image models from providers including xAI Grok, OpenAI (gpt-image-1, dall-e-3, dall-e-2), Amazon Bedrock, Fal, DeepInfra, Replicate, Google, Google Vertex, Fireworks, Luma, Together.ai, and Black Forest Labs. Each model lists supported sizes or aspect ratios.

### transcription
Transcribe audio to text using `transcribe()` with support for OpenAI, Groq, Deepgram, ElevenLabs, and other providers; accepts audio as Uint8Array/Buffer/base64/URL; returns text, segments with timestamps, language, duration; supports provider options, abort signals, custom headers, and error handling.

## Transcription

The AI SDK provides the `transcribe` function (imported as `experimental_transcribe`) to transcribe audio using various transcription models.

### Basic Usage

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});

// Access results
const text = transcript.text; // e.g. "Hello, world!"
const segments = transcript.segments; // array with start/end times (if available)
const language = transcript.language; // e.g. "en" (if available)
const durationInSeconds = transcript.durationInSeconds; // (if available)
```

The `audio` property accepts: `Uint8Array`, `ArrayBuffer`, `Buffer`, base64-encoded string, or URL.

### Provider-Specific Settings

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

```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  abortSignal: AbortSignal.timeout(1000), // Abort after 1 second
});
```

### Custom Headers

```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### Warnings

```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});

const warnings = transcript.warnings; // unsupported parameters, etc.
```

### Error Handling

When transcription fails, `transcribe` throws `AI_NoTranscriptGeneratedError`. This can occur if the model fails to generate a response or the response cannot be parsed.

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
    console.log('Responses:', error.responses); // metadata about model responses
  }
}
```

### Supported Models

OpenAI: `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`
ElevenLabs: `scribe_v1`, `scribe_v1_experimental`
Groq: `whisper-large-v3-turbo`, `distil-whisper-large-v3-en`, `whisper-large-v3`
Azure OpenAI: `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`
Rev.ai: `machine`, `low_cost`, `fusion`
Deepgram: `base`, `enhanced`, `nova`, `nova-2`, `nova-3` (with variants)
Gladia: `default`
AssemblyAI: `best`, `nano`
Fal: `whisper`, `wizper`

**Note:** Transcription is an experimental feature.

### speech
Text-to-speech generation via `generateSpeech()` with configurable voice, language, provider options, timeouts, headers; supports OpenAI, ElevenLabs, LMNT, Hume models; throws `AI_NoSpeechGeneratedError` on failure.

## Speech Generation

The `generateSpeech` function converts text to audio using speech models.

### Basic Usage

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

### Language Setting

```ts
const audio = await generateSpeech({
  model: lmnt.speech('aurora'),
  text: 'Hola, mundo!',
  language: 'es', // Spanish
});
```

### Provider-Specific Settings

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  providerOptions: {
    openai: {
      // provider-specific options
    },
  },
});
```

### Abort Signals and Timeouts

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  abortSignal: AbortSignal.timeout(1000),
});
```

### Custom Headers

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### Warnings

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
});

const warnings = audio.warnings;
```

### Error Handling

Throws `AI_NoSpeechGeneratedError` when generation fails. The error includes `responses` (metadata about model responses) and `cause` (detailed error information).

```ts
import { experimental_generateSpeech as generateSpeech, NoSpeechGeneratedError } from 'ai';

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

### Supported Models

OpenAI: `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`
ElevenLabs: `eleven_v3`, `eleven_multilingual_v2`, `eleven_flash_v2_5`, `eleven_flash_v2`, `eleven_turbo_v2_5`, `eleven_turbo_v2`
LMNT: `aurora`, `blizzard`
Hume: `default`

**Note:** Speech is an experimental feature.

### language_model_middleware
Middleware pattern for intercepting/modifying language model calls; built-in options for reasoning extraction, streaming simulation, defaults; custom implementations via transformParams/wrapGenerate/wrapStream; examples: logging, caching, RAG, guardrails; per-request metadata via providerOptions.

Language model middleware intercepts and modifies language model calls to add features like guardrails, RAG, caching, and logging in a model-agnostic way.

**Using Middleware:**
Wrap a model with `wrapLanguageModel()`:
```ts
import { wrapLanguageModel } from 'ai';
const wrapped = wrapLanguageModel({ model: yourModel, middleware: yourMiddleware });
// Use like any other model in streamText, generateText, etc.
```

Multiple middlewares are applied in order: `wrapLanguageModel({ model, middleware: [first, second] })` applies as `first(second(model))`.

**Built-in Middleware:**
- `extractReasoningMiddleware({ tagName: 'think' })`: Extracts reasoning from special tags and exposes as `reasoning` property. Option `startWithReasoning: true` prepends the tag.
- `simulateStreamingMiddleware()`: Simulates streaming for non-streaming models.
- `defaultSettingsMiddleware({ settings: { temperature, maxOutputTokens, providerOptions } })`: Applies default settings.

**Community Middleware:**
- Custom tool call parser (`@ai-sdk-tool/parser`): Enables function calling on models without native support via `createToolMiddleware()`, `hermesToolMiddleware`, or `gemmaToolMiddleware`. Example: `wrapLanguageModel({ model: openrouter('google/gemma-3-27b-it'), middleware: gemmaToolMiddleware })`.

**Implementing Custom Middleware:**
Implement `LanguageModelV3Middleware` with any of:
1. `transformParams({ params })`: Modify parameters before passing to model (for both generate and stream).
2. `wrapGenerate({ doGenerate, params })`: Wrap the generate method, modify params/result.
3. `wrapStream({ doStream, params })`: Wrap the stream method, modify params/result.

**Examples:**

Logging:
```ts
export const logMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('params:', JSON.stringify(params, null, 2));
    const result = await doGenerate();
    console.log('text:', result.text);
    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    console.log('params:', JSON.stringify(params, null, 2));
    const { stream, ...rest } = await doStream();
    let generatedText = '';
    const textBlocks = new Map<string, string>();
    const transformStream = new TransformStream<LanguageModelV3StreamPart, LanguageModelV3StreamPart>({
      transform(chunk, controller) {
        if (chunk.type === 'text-start') textBlocks.set(chunk.id, '');
        else if (chunk.type === 'text-delta') {
          const existing = textBlocks.get(chunk.id) || '';
          textBlocks.set(chunk.id, existing + chunk.delta);
          generatedText += chunk.delta;
        } else if (chunk.type === 'text-end') console.log(`Block ${chunk.id}:`, textBlocks.get(chunk.id));
        controller.enqueue(chunk);
      },
      flush() { console.log('text:', generatedText); }
    });
    return { stream: stream.pipeThrough(transformStream), ...rest };
  }
};
```

Caching:
```ts
const cache = new Map<string, any>();
export const cacheMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const key = JSON.stringify(params);
    if (cache.has(key)) return cache.get(key);
    const result = await doGenerate();
    cache.set(key, result);
    return result;
  }
};
```

RAG (transformParams approach):
```ts
export const ragMiddleware: LanguageModelV3Middleware = {
  transformParams: async ({ params }) => {
    const text = getLastUserMessageText({ prompt: params.prompt });
    if (!text) return params;
    const instruction = 'Use this info:\n' + findSources({ text }).map(c => JSON.stringify(c)).join('\n');
    return addToLastUserMessage({ params, text: instruction });
  }
};
```

Guardrails (filtering):
```ts
export const guardrailMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate }) => {
    const { text, ...rest } = await doGenerate();
    return { text: text?.replace(/badword/g, '<REDACTED>'), ...rest };
  }
};
```

**Custom Metadata Per Request:**
Pass metadata via `providerOptions` and access in middleware:
```ts
export const logMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('METADATA', params?.providerMetadata?.logMiddleware);
    return doGenerate();
  }
};

const { text } = await generateText({
  model: wrapLanguageModel({ model: 'anthropic/claude-sonnet-4.5', middleware: logMiddleware }),
  prompt: 'Invent a new holiday...',
  providerOptions: { logMiddleware: { hello: 'world' } }
});
```

### provider-and-model-management
Manage multiple providers and models via custom providers (pre-configured settings/aliases/limits) and provider registries (string ID access with customizable separators); set global default provider via globalThis.AI_SDK_DEFAULT_PROVIDER.

## Custom Providers

Create custom providers using `customProvider()` to pre-configure model settings, provide aliases, and limit available models.

**Override default settings:**
```ts
import { gateway, customProvider, defaultSettingsMiddleware, wrapLanguageModel } from 'ai';

export const openai = customProvider({
  languageModels: {
    'gpt-5.1': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: { reasoningEffort: 'high' },
          },
        },
      }),
    }),
  },
  fallbackProvider: gateway,
});
```

**Model name aliases:**
```ts
export const anthropic = customProvider({
  languageModels: {
    opus: gateway('anthropic/claude-opus-4.1'),
    sonnet: gateway('anthropic/claude-sonnet-4.5'),
    haiku: gateway('anthropic/claude-haiku-4.5'),
  },
  fallbackProvider: gateway,
});
```

**Limit available models:**
```ts
export const myProvider = customProvider({
  languageModels: {
    'text-medium': gateway('anthropic/claude-3-5-sonnet-20240620'),
    'text-small': gateway('openai/gpt-5-mini'),
    'reasoning-medium': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: { openai: { reasoningEffort: 'high' } },
        },
      }),
    }),
  },
  embeddingModels: {
    embedding: gateway.embeddingModel('openai/text-embedding-3-small'),
  },
});
```

## Provider Registry

Create a provider registry using `createProviderRegistry()` to manage multiple providers and access them via string IDs.

**Setup:**
```ts
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { createProviderRegistry, gateway } from 'ai';

export const registry = createProviderRegistry({
  gateway,
  anthropic,
  openai,
});
```

**Custom separator (default is `:`)**:
```ts
export const customSeparatorRegistry = createProviderRegistry(
  { gateway, anthropic, openai },
  { separator: ' > ' },
);
```

**Access language models:**
```ts
import { generateText } from 'ai';
import { registry } from './registry';

const { text } = await generateText({
  model: registry.languageModel('openai:gpt-5.1'),
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Access embedding models:**
```ts
import { embed } from 'ai';

const { embedding } = await embed({
  model: registry.embeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```

**Access image models:**
```ts
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: registry.imageModel('openai:dall-e-3'),
  prompt: 'A beautiful sunset over a calm ocean',
});
```

## Combined Example

```ts
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { xai } from '@ai-sdk/xai';
import { groq } from '@ai-sdk/groq';
import { createProviderRegistry, customProvider, defaultSettingsMiddleware, gateway, wrapLanguageModel } from 'ai';

export const registry = createProviderRegistry(
  {
    gateway,
    xai,
    custom: createOpenAICompatible({
      name: 'provider-name',
      apiKey: process.env.CUSTOM_API_KEY,
      baseURL: 'https://api.custom.com/v1',
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
                  thinking: { type: 'enabled', budgetTokens: 32000 },
                } satisfies AnthropicProviderOptions,
              },
            },
          }),
        }),
      },
      fallbackProvider: anthropic,
    }),
    groq: customProvider({
      languageModels: {
        'gemma2-9b-it': groq('gemma2-9b-it'),
        'qwen-qwq-32b': groq('qwen-qwq-32b'),
      },
    }),
  },
  { separator: ' > ' },
);

const model = registry.languageModel('anthropic > reasoning');
```

## Global Provider Configuration

By default, the global provider is the Vercel AI Gateway. Customize it:

```ts
// setup.ts
import { openai } from '@ai-sdk/openai';
globalThis.AI_SDK_DEFAULT_PROVIDER = openai;

// app.ts
import { streamText } from 'ai';
const result = await streamText({
  model: 'gpt-5.1', // Uses OpenAI provider without prefix
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

### error-handling
Try/catch for regular and simple stream errors; switch on part.type for full streams (error/abort/tool-error); onAbort callback for cleanup on abort with steps array.

## Error Handling in AI SDK Core

### Regular Errors
Regular errors from functions like `generateText()` are thrown and caught with try/catch:

```ts
import { generateText } from 'ai';

try {
  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
} catch (error) {
  // handle error
}
```

### Streaming Errors (Simple Streams)
Errors during streams without error chunk support are thrown as regular errors:

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

### Streaming Errors (Full Streams with Error Support)
Full streams support error parts that can be handled within the stream loop:

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
  // handle error outside streaming
}
```

### Handling Stream Aborts
Use the `onAbort` callback for cleanup when streams are aborted (e.g., via stop button). The callback receives an array of completed steps and is not called on normal completion:

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

Alternatively, handle abort events directly in the stream by checking for `chunk.type === 'abort'`.

### testing
Mock providers (MockLanguageModelV3, MockEmbeddingModelV3) and test helpers (mockId, mockValues, simulateReadableStream) from ai/test enable deterministic unit testing of AI SDK code without calling real providers.

## Testing Language Models

Testing language models is challenging due to non-determinism, slowness, and cost. The AI SDK Core provides mock providers and test helpers to enable unit testing without calling actual providers.

### Available Test Helpers

Import from `ai/test`:
- `MockLanguageModelV3`: Mock language model following the v3 specification
- `MockEmbeddingModelV3`: Mock embedding model following the v3 specification
- `mockId`: Provides incrementing integer IDs
- `mockValues`: Iterates over array values, returns last value when exhausted
- `simulateReadableStream`: Simulates readable streams with configurable delays

### Examples

**generateText:**
```ts
import { generateText } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';

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

**streamText:**
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

**generateObject:**
```ts
import { generateObject } from 'ai';
import { z } from 'zod';

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

**streamObject:**
```ts
import { streamObject } from 'ai';

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

**Simulate UI Message Stream Responses:**
```ts
import { simulateReadableStream } from 'ai';

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

Mock providers enable deterministic, repeatable testing without calling actual language model providers.

### telemetry
OpenTelemetry integration for AI SDK with experimental telemetry option; records spans for text/object generation and embedding with configurable input/output recording, custom tracers, and detailed attributes including model, tokens, responses, and tool calls.

## Overview
AI SDK uses OpenTelemetry to collect telemetry data. The feature is experimental and may change. For Next.js apps, enable OpenTelemetry first via the Next.js guide.

## Enabling Telemetry
Use the `experimental_telemetry` option on function calls:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: { isEnabled: true },
});
```

Control input/output recording with `recordInputs` and `recordOutputs` (both enabled by default). Disable for privacy/performance reasons.

## Telemetry Metadata
Provide `functionId` to identify the function and `metadata` for additional context:
```ts
experimental_telemetry: {
  isEnabled: true,
  functionId: 'my-awesome-function',
  metadata: {
    something: 'custom',
    someOtherThing: 'other-value',
  },
}
```

## Custom Tracer
Provide a custom `tracer` returning an OpenTelemetry `Tracer` to use a different `TracerProvider`:
```ts
const tracerProvider = new NodeTracerProvider();
experimental_telemetry: {
  isEnabled: true,
  tracer: tracerProvider.getTracer('ai'),
}
```

## Collected Data

### generateText
Records 3 span types:
- `ai.generateText`: full call span with `operation.name`, `ai.operationId`, `ai.prompt`, `ai.response.text`, `ai.response.toolCalls`, `ai.response.finishReason`, `ai.settings.maxOutputTokens`
- `ai.generateText.doGenerate`: provider call span with `ai.prompt.messages`, `ai.prompt.tools`, `ai.prompt.toolChoice`, response attributes
- `ai.toolCall`: tool call spans (see Tool call spans section)

### streamText
Records 3 span types and 2 event types:
- `ai.streamText`: full call span with prompt, response text/toolCalls/finishReason, maxOutputTokens
- `ai.streamText.doStream`: provider call span with messages, tools, toolChoice, response text/toolCalls, `ai.response.msToFirstChunk`, `ai.response.msToFinish`, `ai.response.avgCompletionTokensPerSecond`
- `ai.toolCall`: tool call spans
- `ai.stream.firstChunk` event: emitted when first chunk received, contains `ai.response.msToFirstChunk`
- `ai.stream.finish` event: emitted when finish part received

### generateObject
Records 2 span types:
- `ai.generateObject`: full call span with `ai.prompt`, `ai.schema`, `ai.schema.name`, `ai.schema.description`, `ai.response.object`, `ai.settings.output`
- `ai.generateObject.doGenerate`: provider call span with `ai.prompt.messages`, `ai.response.object`, `ai.response.finishReason`

### streamObject
Records 2 span types and 1 event type:
- `ai.streamObject`: full call span with prompt, schema, schema name/description, response object, output setting
- `ai.streamObject.doStream`: provider call span with messages, response object, `ai.response.msToFirstChunk`, finishReason
- `ai.stream.firstChunk` event: contains `ai.response.msToFirstChunk`

### embed
Records 2 span types:
- `ai.embed`: full call span with `ai.value`, `ai.embedding`
- `ai.embed.doEmbed`: provider call span with `ai.values`, `ai.embeddings`

### embedMany
Records 2 span types:
- `ai.embedMany`: full call span with `ai.values`, `ai.embeddings`
- `ai.embedMany.doEmbed`: provider call span with `ai.values`, `ai.embeddings`

## Span Attributes

### Basic LLM span information
Common to most LLM spans: `resource.name`, `ai.model.id`, `ai.model.provider`, `ai.request.headers.*`, `ai.response.providerMetadata`, `ai.settings.maxRetries`, `ai.telemetry.functionId`, `ai.telemetry.metadata.*`, `ai.usage.completionTokens`, `ai.usage.promptTokens`

### Call LLM span information
Individual LLM call spans include basic LLM info plus: `ai.response.model`, `ai.response.id`, `ai.response.timestamp`, and OpenTelemetry GenAI semantic conventions (`gen_ai.system`, `gen_ai.request.model`, `gen_ai.request.temperature`, `gen_ai.request.max_tokens`, `gen_ai.request.frequency_penalty`, `gen_ai.request.presence_penalty`, `gen_ai.request.top_k`, `gen_ai.request.top_p`, `gen_ai.request.stop_sequences`, `gen_ai.response.finish_reasons`, `gen_ai.response.model`, `gen_ai.response.id`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`)

### Basic embedding span information
Common to embedding spans: `ai.model.id`, `ai.model.provider`, `ai.request.headers.*`, `ai.settings.maxRetries`, `ai.telemetry.functionId`, `ai.telemetry.metadata.*`, `ai.usage.tokens`, `resource.name`

### Tool call spans
Tool call spans contain: `operation.name` ("ai.toolCall"), `ai.operationId` ("ai.toolCall"), `ai.toolCall.name`, `ai.toolCall.id`, `ai.toolCall.args`, `ai.toolCall.result` (if successful and serializable)

