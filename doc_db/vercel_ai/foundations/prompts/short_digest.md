## Prompt Types

**Text Prompts** - Simple strings via `prompt` property, supports template literals:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: `Trip to ${destination} for ${lengthOfStay} days. Suggest activities.`,
});
```

**System Prompts** - Initial instructions via `system` property, guides model behavior:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You help planning travel itineraries.',
  prompt: `Trip to ${destination}...`,
});
```

**Message Prompts** - Arrays of user/assistant/tool messages via `messages` property:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
    { role: 'user', content: 'Where can I buy Currywurst in Berlin?' },
  ],
});
```

## Provider Options

Pass provider-specific metadata at function, message, or message part level:
```ts
// Function level
const { text } = await generateText({
  model: azure('deployment'),
  providerOptions: { openai: { reasoningEffort: 'low' } },
});

// Message level
const messages: ModelMessage[] = [
  {
    role: 'system',
    content: 'Cached system message',
    providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' } } },
  },
];

// Message part level
const messages: ModelMessage[] = [
  {
    role: 'user',
    content: [
      { type: 'text', text: 'Describe image.', providerOptions: { openai: { imageDetail: 'low' } } },
      { type: 'image', image: 'https://example.com/image.png', providerOptions: { openai: { imageDetail: 'low' } } },
    ],
  },
];
```

## Message Content Types

**User Messages:**
- Text parts: strings or array of text objects
- Image parts: base64, binary (Buffer/Uint8Array/ArrayBuffer), or URL formats
- File parts: PDF, audio (mp3/wav), supported by Google Generative AI, Vertex AI, OpenAI, Anthropic

**Assistant Messages:**
- Text content (string or array)
- Tool call parts with toolCallId, toolName, input
- File content (model-generated, limited support)

**Tool Messages:**
- Tool result parts with toolCallId, toolName, output (json or content type)
- Multi-modal tool results (experimental, Anthropic only)

**System Messages:**
- Sent before user messages to guide behavior, set via `messages` array or `system` property

## Custom Download Function

Implement via `experimental_download` property for throttling, retries, authentication, caching. Default downloads files in parallel when not model-supported.