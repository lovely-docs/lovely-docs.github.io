## Tool Invocation Missing Result Error

When using `generateText()` or `streamText()`, the error "ToolInvocation must have a result" occurs when a tool without an `execute` function is called but no result is provided.

### Root Cause
Each tool invocation requires the model to receive a result before continuing. Without a result, the model cannot determine success/failure and the conversation state becomes invalid.

### Solutions

**Option 1: Server-side execution with `execute` function**
```tsx
const tools = {
  weather: tool({
    description: 'Get the weather in a location',
    parameters: z.object({
      location: z.string().describe('The city and state, e.g. "San Francisco, CA"'),
    }),
    execute: async ({ location }) => {
      return { temperature: 72, conditions: 'sunny', location };
    },
  }),
};
```

**Option 2: Client-side execution with `useChat` and `addToolOutput`**
```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';

const { messages, sendMessage, addToolOutput } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  onToolCall: async ({ toolCall }) => {
    if (toolCall.toolName === 'getLocation') {
      try {
        const result = await getLocationData();
        addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: result,
        });
      } catch (err) {
        addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          state: 'output-error',
          errorText: 'Failed to get location',
        });
      }
    }
  },
});
```

For interactive UI elements, call `addToolOutput` from event handlers:
```tsx
const { messages, sendMessage, addToolOutput } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
});

<button
  onClick={() =>
    addToolOutput({
      tool: 'myTool',
      toolCallId,
      output: { /* result */ },
    })
  }
>
  Confirm
</button>
```

**Critical**: Every tool call must have a corresponding result before conversation continues. When handling tools client-side, don't await inside `onToolCall` to avoid deadlocks.