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