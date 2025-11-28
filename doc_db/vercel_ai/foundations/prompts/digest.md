## Prompt Types

The AI SDK supports three prompt structures:

### Text Prompts
Simple string prompts set via the `prompt` property. Ideal for simple generation use cases. Supports template literals for dynamic data injection.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: `I am planning a trip to ${destination} for ${lengthOfStay} days. Please suggest the best tourist activities.`,
});
```

### System Prompts
Initial instructions that guide and constrain model behavior. Set via the `system` property, works with both `prompt` and `messages` properties.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You help planning travel itineraries. Respond with a list of the best stops.',
  prompt: `I am planning a trip to ${destination} for ${lengthOfStay} days.`,
});
```

### Message Prompts
Arrays of user, assistant, and tool messages for chat interfaces and complex multi-modal prompts. Set via the `messages` property. Each message has a `role` and `content` property.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
    { role: 'user', content: 'Where can I buy the best Currywurst in Berlin?' },
  ],
});
```

## Provider Options

Pass provider-specific metadata at three levels:

**Function call level** - for general provider options:
```ts
const { text } = await generateText({
  model: azure('your-deployment-name'),
  providerOptions: {
    openai: { reasoningEffort: 'low' },
  },
});
```

**Message level** - for granular control:
```ts
const messages: ModelMessage[] = [
  {
    role: 'system',
    content: 'Cached system message',
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  },
];
```

**Message part level** - for specific content parts:
```ts
const messages: ModelMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Describe the image in detail.',
        providerOptions: { openai: { imageDetail: 'low' } },
      },
      {
        type: 'image',
        image: 'https://example.com/image.png',
        providerOptions: { openai: { imageDetail: 'low' } },
      },
    ],
  },
];
```

Note: UI hooks like `useChat` return `UIMessage` objects without provider options support. Use `convertToModelMessages` to convert to `ModelMessage` objects first.

## User Messages

### Text Parts
Text content is the most common type. Can be a string directly or within an array of content parts.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Where can I buy the best Currywurst in Berlin?' },
      ],
    },
  ],
});
```

### Image Parts
User messages can include images in multiple formats:
- Base64-encoded: `string` with base-64 content or data URL `data:image/png;base64,...`
- Binary: `ArrayBuffer`, `Uint8Array`, or `Buffer`
- URL: http(s) URL `string` or `URL` object

```ts
// Binary image (Buffer)
const result = await generateText({
  model,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        { type: 'image', image: fs.readFileSync('./data/comic-cat.png') },
      ],
    },
  ],
});

// Base64 encoded image
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        { type: 'image', image: fs.readFileSync('./data/comic-cat.png').toString('base64') },
      ],
    },
  ],
});

// Image URL
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        { type: 'image', image: 'https://example.com/image.png' },
      ],
    },
  ],
});
```

### File Parts
Only supported by Google Generative AI, Google Vertex AI, OpenAI (wav/mp3 audio with gpt-4o-audio-preview, and pdf), and Anthropic. Requires specifying the MIME type.

```ts
// PDF file from Buffer
import { google } from '@ai-sdk/google';
const result = await generateText({
  model: google('gemini-1.5-flash'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the file about?' },
        {
          type: 'file',
          mediaType: 'application/pdf',
          data: fs.readFileSync('./data/example.pdf'),
          filename: 'example.pdf',
        },
      ],
    },
  ],
});

// MP3 audio file from Buffer
import { openai } from '@ai-sdk/openai';
const result = await generateText({
  model: openai('gpt-4o-audio-preview'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the audio saying?' },
        {
          type: 'file',
          mediaType: 'audio/mpeg',
          data: fs.readFileSync('./data/galileo.mp3'),
        },
      ],
    },
  ],
});
```

### Custom Download Function (Experimental)
Implement throttling, retries, authentication, caching via the `experimental_download` property. The default implementation automatically downloads files in parallel when not supported by the model.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  experimental_download: async (
    requestedDownloads: Array<{
      url: URL;
      isUrlSupportedByModel: boolean;
    }>,
  ): PromiseLike<
    Array<{
      data: Uint8Array;
      mediaType: string | undefined;
    } | null>
  > => {
    // download files and return array with similar order
  },
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'file',
          data: new URL('https://api.company.com/private/document.pdf'),
          mediaType: 'application/pdf',
        },
      ],
    },
  ],
});
```

## Assistant Messages

Messages with role `assistant` are typically previous responses from the assistant. Can contain text, reasoning, and tool call parts.

```ts
// Text content
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
  ],
});

// Text content in array
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Hi!' },
    {
      role: 'assistant',
      content: [{ type: 'text', text: 'Hello, how can I help?' }],
    },
  ],
});

// Tool call content
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'How many calories are in this block of cheese?' },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          input: { cheese: 'Roquefort' },
        },
      ],
    },
  ],
});

// File content (model-generated, only few models support)
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Generate an image of a roquefort cheese!' },
    {
      role: 'assistant',
      content: [
        {
          type: 'file',
          mediaType: 'image/png',
          data: fs.readFileSync('./data/roquefort.jpg'),
        },
      ],
    },
  ],
});
```

## Tool Messages

For models supporting tool calls, assistant messages can contain tool call parts and tool messages can contain tool output parts. A single assistant message can call multiple tools, and a single tool message can contain multiple tool results.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'How many calories are in this block of cheese?' },
        { type: 'image', image: fs.readFileSync('./data/roquefort.jpg') },
      ],
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          input: { cheese: 'Roquefort' },
        },
      ],
    },
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          output: {
            type: 'json',
            value: {
              name: 'Cheese, roquefort',
              calories: 369,
              fat: 31,
              protein: 22,
            },
          },
        },
      ],
    },
  ],
});
```

### Multi-modal Tool Results (Experimental)
Tool results can be multi-part and multi-modal (text and image). Only supported by Anthropic. Use the `experimental_content` property on tool parts.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          output: {
            type: 'json',
            value: {
              name: 'Cheese, roquefort',
              calories: 369,
              fat: 31,
              protein: 22,
            },
          },
        },
        {
          type: 'tool-result',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          output: {
            type: 'content',
            value: [
              { type: 'text', text: 'Here is an image of the nutrition data:' },
              {
                type: 'media',
                data: fs.readFileSync('./data/roquefort-nutrition-data.png').toString('base64'),
                mediaType: 'image/png',
              },
            ],
          },
        },
      ],
    },
  ],
});
```

## System Messages

System messages are sent before user messages to guide assistant behavior. Can be set via `messages` array with role `system` or via the `system` property.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'system', content: 'You help planning travel itineraries.' },
    {
      role: 'user',
      content: 'I am planning a trip to Berlin for 3 days. Please suggest the best tourist activities.',
    },
  ],
});
```