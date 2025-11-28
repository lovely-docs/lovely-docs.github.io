## convertToModelMessages()

Transforms UI messages from the `useChat` hook into `ModelMessage` objects compatible with AI core functions like `streamText`.

### Basic Usage

```ts
import { convertToModelMessages, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  
  return result.toUIMessageStreamResponse();
}
```

### API Signature

**Parameters:**
- `messages` (Message[]): Array of UI messages from useChat hook
- `options` (optional): Configuration object with:
  - `tools?: ToolSet`: Enable multi-modal tool responses
  - `convertDataPart?: (part: DataUIPart) => TextPart | FilePart | null`: Transform custom data parts

**Returns:** ModelMessage[] array

### Multi-modal Tool Responses

Tools can return non-text content by implementing `toModelOutput` method:

```ts
import { tool } from 'ai';
import { z } from 'zod';

const screenshotTool = tool({
  parameters: z.object({}),
  execute: async () => 'imgbase64',
  toModelOutput: result => [{ type: 'image', data: result }],
});

const result = streamText({
  model: openai('gpt-4'),
  messages: convertToModelMessages(messages, {
    tools: { screenshot: screenshotTool },
  }),
});
```

### Custom Data Part Conversion

By default, data parts are filtered out. Use `convertDataPart` callback to include them:

```ts
type CustomUIMessage = UIMessage<
  never,
  {
    url: { url: string; title: string; content: string };
    'code-file': { filename: string; code: string; language: string };
  }
>;

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages<CustomUIMessage>(messages, {
    convertDataPart: part => {
      if (part.type === 'data-url') {
        return {
          type: 'text',
          text: `[Reference: ${part.data.title}](${part.data.url})\n\n${part.data.content}`,
        };
      }
      if (part.type === 'data-code-file') {
        return {
          type: 'text',
          text: `\`\`\`${part.data.language}\n// ${part.data.filename}\n${part.data.code}\n\`\`\``,
        };
      }
    },
  }),
});
```

**Use Cases:**
- **URL attachments**: Users attach URLs with fetched content formatted for the model
- **Code files**: Users reference code files as context in conversations
- **Selective inclusion**: Only data parts returning text/file parts are included; others ignored

**Type Safety:** Generic parameter ensures full type safety for custom data parts:

```ts
type MyUIMessage = UIMessage<
  unknown,
  {
    url: { url: string; content: string };
    config: { key: string; value: string };
  }
>;

convertToModelMessages<MyUIMessage>(messages, {
  convertDataPart: part => {
    if (part.type === 'data-url') {
      return { type: 'text', text: part.data.url };
    }
    return null;
  },
});
```