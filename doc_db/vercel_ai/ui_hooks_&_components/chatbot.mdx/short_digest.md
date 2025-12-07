## useChat Hook

Creates conversational UIs with real-time message streaming and managed state.

### Basic Usage
```tsx
const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

// Render messages with message.parts (text, tool invocations, results)
// Status: 'submitted' | 'streaming' | 'ready' | 'error'
```

### UI Customization
- **Status handling**: Show spinner, stop button, disable submit based on status
- **Error handling**: Display error message and retry button
- **Modify messages**: Use `setMessages()` to delete/edit
- **Cancellation**: `stop()` aborts current response
- **Regeneration**: `regenerate()` reprocesses last message
- **Throttle updates**: `experimental_throttle: 50` (React only)

### Event Callbacks
```tsx
useChat({
  onFinish: ({ message, messages, isAbort, isDisconnect, isError }) => {},
  onError: error => {},
  onData: data => {},
});
```

### Request Configuration
**Hook-level** (all requests):
```tsx
transport: new DefaultChatTransport({
  api: '/api/chat',
  headers: { Authorization: 'token' },
  body: { user_id: '123' },
  credentials: 'same-origin',
})
```

**Dynamic hook-level** (for refreshing tokens):
```tsx
headers: () => ({ Authorization: `Bearer ${getAuthToken()}` }),
body: () => ({ sessionId: getCurrentSessionId() }),
```

**Request-level** (recommended, per-request):
```tsx
sendMessage({ text: input }, {
  headers: { Authorization: 'Bearer token' },
  body: { temperature: 0.7 },
  metadata: { userId: 'user123' },
});
```

### Message Metadata
Attach custom metadata (timestamps, model, token usage):
```tsx
// Server
messageMetadata: ({ part }) => {
  if (part.type === 'start') return { createdAt: Date.now(), model: 'gpt-5.1' };
  if (part.type === 'finish') return { totalTokens: part.totalUsage.totalTokens };
}

// Client: access via message.metadata
```

### Transport Configuration
**Custom request format**:
```tsx
prepareSendMessagesRequest: ({ id, messages }) => ({
  body: { id, message: messages[messages.length - 1] }
})
```

**Trigger-based routing** (for regeneration):
```tsx
prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
  if (trigger === 'submit-user-message') { /* ... */ }
  else if (trigger === 'regenerate-assistant-message') { /* ... */ }
}
```

### Response Stream Control
- **Error messages**: Customize with `onError` callback
- **Usage info**: Send via `messageMetadata` on finish
- **Text streams**: Use `TextStreamChatTransport` (no tool calls/usage)
- **Reasoning**: Forward with `sendReasoning: true` (DeepSeek, Claude)
- **Sources**: Forward with `sendSources: true` (Perplexity, Google)

### Image Generation
Models like `gemini-2.5-flash-image-preview` generate images as file parts:
```tsx
if (part.type === 'file' && part.mediaType.startsWith('image/')) {
  return <img src={part.url} alt="Generated image" />;
}
```

### Attachments
**FileList** (auto-converts `image/*` and `text/*`):
```tsx
const [files, setFiles] = useState<FileList>();
sendMessage({ text: input, files });
```

**File objects** (pre-uploaded or data URLs):
```tsx
const files: FileUIPart[] = [{
  type: 'file',
  filename: 'earth.png',
  mediaType: 'image/png',
  url: 'https://example.com/earth.png',
}];
sendMessage({ text: input, files });
```

### Type Inference for Tools
```tsx
import { InferUITool, InferUITools } from 'ai';

type WeatherUITool = InferUITool<typeof weatherTool>;
type MyUITools = InferUITools<typeof tools>;
type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;

const { messages } = useChat<MyUIMessage>();
```