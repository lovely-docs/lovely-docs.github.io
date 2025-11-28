Converts UI messages from `useChat` hook to `ModelMessage` objects for AI functions.

**Basic usage:**
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
});
```

**Multi-modal tool responses** via `toModelOutput` method:
```ts
const screenshotTool = tool({
  execute: async () => 'imgbase64',
  toModelOutput: result => [{ type: 'image', data: result }],
});

streamText({
  messages: convertToModelMessages(messages, { tools: { screenshot: screenshotTool } }),
});
```

**Custom data part conversion** with `convertDataPart` callback:
```ts
convertToModelMessages<CustomUIMessage>(messages, {
  convertDataPart: part => {
    if (part.type === 'data-url') {
      return { type: 'text', text: `[${part.data.title}](${part.data.url})` };
    }
  },
});
```

Supports attaching URLs, code files, and other custom data to messages with type-safe generic parameter.