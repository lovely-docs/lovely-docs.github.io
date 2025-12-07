## Chatbot Message Persistence

Store and load chat messages using `useChat` and `streamText`.

**Creating chats:** Generate unique ID with `generateId()`, create empty chat file.

**Loading chats:** Parse stored JSON messages with `loadChat(id)`.

**Validating messages:** Use `validateUIMessages()` to validate messages with tools, metadata, or custom data parts before sending to model. Handle `TypeValidationError` gracefully.

**Displaying chat:** Load messages in page component, pass to `useChat` hook with `initialMessages` prop.

**Storing messages:** Save in `onFinish` callback of `toUIMessageStreamResponse()`. Store in `useChat` format (includes `id`, `createdAt`), not `ModelMessage` format.

**Message IDs:** For persistence, use server-side ID generation with `generateMessageId: createIdGenerator()` in `toUIMessageStreamResponse()`, or use `createUIMessageStream()` to write start message with custom ID.

**Optimizing requests:** Use `prepareSendMessagesRequest()` in transport to send only last message. Load previous messages on server and append new message before validation.

**Handling disconnects:** Call `result.consumeStream()` (without await) to ensure stream completes and `onFinish` triggers even after client disconnect. Chat restores from storage on reload.