## Reading UIMessage Streams

`readUIMessageStream` transforms `UIMessageChunk` streams into `AsyncIterableStream` of `UIMessage` objects for terminal UIs, custom client processing, or RSCs.

**Basic usage:**
```tsx
for await (const uiMessage of readUIMessageStream({
  stream: result.toUIMessageStream(),
})) {
  console.log('Current message state:', uiMessage);
}
```

**Handle tool calls by checking part types:**
```tsx
uiMessage.parts.forEach(part => {
  switch (part.type) {
    case 'text': console.log('Text:', part.text); break;
    case 'tool-call': console.log('Tool:', part.toolName, part.args); break;
    case 'tool-result': console.log('Result:', part.result); break;
  }
});
```

**Resume from previous message:**
```tsx
for await (const uiMessage of readUIMessageStream({
  stream: result.toUIMessageStream(),
  message: lastMessage,
})) { ... }
```