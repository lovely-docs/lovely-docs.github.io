## Prompts

Three prompt types: **text** (simple strings), **system** (initial instructions), **messages** (array of user/assistant/tool messages for chat/multi-modal).

```ts
// Text prompt
await generateText({ model, prompt: 'Invent a new holiday...' });

// System + text
await generateText({ 
  model, 
  system: 'You help planning travel itineraries.',
  prompt: 'I am planning a trip to ${destination}...'
});

// Messages
await generateText({
  model,
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
    { role: 'user', content: 'Where can I buy the best Currywurst in Berlin?' },
  ],
});
```

**Message content types**: text, images (base64/binary/URL), files (PDF, audio), tool calls, tool results.

**Provider options** at function, message, or message-part level:
```ts
// Function level
await generateText({
  model,
  providerOptions: { openai: { reasoningEffort: 'low' } },
});

// Message level
{ role: 'system', content: '...', providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' } } } }

// Message part level
{ type: 'text', text: '...', providerOptions: { openai: { imageDetail: 'low' } } }
```

**User messages**: text, images (base64/binary/URL), files (with MIME type), custom download function.

**Assistant messages**: text, tool calls, model-generated files.

**Tool messages**: tool results (JSON or multi-modal content with text+images).

**System messages**: guide behavior, alternative to `system` property.