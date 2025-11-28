## Overview
Stream additional data alongside model responses to the client and attach it to UIMessage parts array. Use `createUIMessageStream`, `createUIMessageStreamResponse`, or `pipeUIMessageStreamToResponse` helpers. Data streams via Server-Sent Events.

## Type-Safe Data Streaming Setup
Define custom message type with data part schemas:
```tsx
export type MyUIMessage = UIMessage<
  never,
  {
    weather: { city: string; weather?: string; status: 'loading' | 'success' };
    notification: { message: string; level: 'info' | 'warning' | 'error' };
  }
>;
```

## Server-Side Streaming
Create UIMessageStream in route handler:
```tsx
const stream = createUIMessageStream<MyUIMessage>({
  execute: ({ writer }) => {
    writer.write({
      type: 'data-notification',
      data: { message: 'Processing...', level: 'info' },
      transient: true,
    });
    writer.write({
      type: 'source',
      value: { type: 'source', sourceType: 'url', id: 'source-1', url: 'https://weather.com', title: 'Weather Data Source' },
    });
    writer.write({
      type: 'data-weather',
      id: 'weather-1',
      data: { city: 'San Francisco', status: 'loading' },
    });
    const result = streamText({ model: 'anthropic/claude-sonnet-4.5', messages: convertToModelMessages(messages) });
    writer.merge(result.toUIMessageStream());
  },
});
return createUIMessageStreamResponse({ stream });
```

## Types of Streamable Data

**Data Parts (Persistent)** - Added to message history, appear in `message.parts`:
```tsx
writer.write({ type: 'data-weather', id: 'weather-1', data: { city: 'San Francisco', status: 'loading' } });
```

**Sources** - For RAG, show referenced documents/URLs:
```tsx
writer.write({ type: 'source', value: { type: 'source', sourceType: 'url', id: 'source-1', url: 'https://example.com', title: 'Example Source' } });
```

**Transient Data Parts** - Sent to client but not added to history, only accessible via `onData` handler:
```tsx
writer.write({ type: 'data-notification', data: { message: 'Processing...', level: 'info' }, transient: true });
```

## Data Part Reconciliation
Write to same data part ID to auto-reconcile/update on client. Enables collaborative artifacts, progressive loading, live status updates, interactive components.

## Client-Side Processing

**Using onData Callback** - Handle streaming data including transient parts:
```tsx
const { messages } = useChat<MyUIMessage>({
  api: '/api/chat',
  onData: dataPart => {
    if (dataPart.type === 'data-weather') console.log('Weather:', dataPart.data);
    if (dataPart.type === 'data-notification') showToast(dataPart.data.message, dataPart.data.level);
  },
});
```
Important: Transient parts only available through `onData`, not in `message.parts`.

**Rendering Persistent Data Parts**:
```tsx
{message.parts
  .filter(part => part.type === 'data-weather')
  .map((part, index) => (
    <div key={index}>
      {part.data.status === 'loading' ? <>Getting weather for {part.data.city}...</> : <>Weather in {part.data.city}: {part.data.weather}</>}
    </div>
  ))}
{message.parts.filter(part => part.type === 'text').map((part, index) => <div key={index}>{part.text}</div>)}
{message.parts.filter(part => part.type === 'source').map((part, index) => <div key={index}><a href={part.url}>{part.title}</a></div>)}
```

## Use Cases
- RAG applications - stream sources and retrieved documents
- Real-time status - loading states and progress updates
- Collaborative tools - live updates to shared artifacts
- Analytics - usage data without cluttering history
- Notifications - temporary alerts and status messages

## Message Metadata vs Data Parts
**Message Metadata** - Message-level info (timestamps, model info, token usage, user context), attached via `message.metadata`, sent using `messageMetadata` callback in `toUIMessageStreamResponse`.

**Data Parts** - Dynamic arbitrary data, added to `message.parts`, streamed via `createUIMessageStream`, reconcilable with same ID, support transient parts.

Can also stream from custom backends (Python/FastAPI) using UI Message Stream Protocol.