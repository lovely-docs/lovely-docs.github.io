## useChat Hook

Creates a conversational UI for chatbot applications with streaming message support, automatic state management, and UI updates.

### Import
- React: `import { useChat } from '@ai-sdk/react'`
- Svelte: `import { Chat } from '@ai-sdk/svelte'`
- Vue: `import { Chat } from '@ai-sdk/vue'`

### Parameters

**chat** (optional): Existing Chat instance; if provided, other parameters are ignored.

**transport** (optional): ChatTransport for sending messages. Defaults to DefaultChatTransport with `/api/chat` endpoint.
- `api`: API endpoint string (default: '/api/chat')
- `credentials`: RequestCredentials mode for fetch
- `headers`: HTTP headers as Record or Headers object
- `body`: Extra body object for requests
- `prepareSendMessagesRequest`: Function to customize request before chat API calls, receives options with id, messages, requestMetadata, body, credentials, headers, api, trigger ('submit-message' | 'regenerate-message'), messageId
- `prepareReconnectToStreamRequest`: Function to customize reconnect request, receives options with id, requestMetadata, body, credentials, headers, api

**id** (optional): Unique chat identifier; randomly generated if not provided.

**messages** (optional): Initial UIMessage[] to populate conversation.

**onToolCall** (optional): Callback `({toolCall: ToolCall}) => void | Promise<void>` invoked when tool call received; must call addToolOutput to provide result.

**sendAutomaticallyWhen** (optional): Function `(options: { messages: UIMessage[] }) => boolean | PromiseLike<boolean>` called when stream finishes or tool call added to determine if messages should resubmit. Use lastAssistantMessageIsCompleteWithToolCalls helper for common scenarios.

**onFinish** (optional): Callback `(options: OnFinishOptions) => void` when assistant response finishes streaming.
- `message`: UIMessage response
- `messages`: UIMessage[] all messages including response
- `isAbort`: boolean, true if client aborted
- `isDisconnect`: boolean, true if server disconnected (network error)
- `isError`: boolean, true if streaming errors stopped response
- `finishReason`: optional string ('stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown')

**onError** (optional): Callback `(error: Error) => void` when error encountered.

**onData** (optional): Callback `(dataPart: DataUIPart) => void` when data part received.

**experimental_throttle** (optional): Custom throttle wait in ms for chat messages and data updates; undefined disables throttling.

**resume** (optional): boolean whether to resume ongoing chat generation stream (default: false).

### Returns

**id**: string, the chat identifier.

**messages**: UIMessage[] current chat messages.
- `id`: string, unique message identifier
- `role`: 'system' | 'user' | 'assistant'
- `parts`: UIMessagePart[] for rendering in UI
- `metadata`: optional unknown metadata

**status**: 'submitted' | 'streaming' | 'ready' | 'error' - current chat status.

**error**: Error | undefined if error occurred.

**sendMessage**: `(message: CreateUIMessage | string, options?: ChatRequestOptions) => void` sends new message and triggers API call for assistant response.
- ChatRequestOptions: `headers` (Record<string, string> | Headers), `body` (object), `data` (JSONValue)

**regenerate**: `(options?: { messageId?: string }) => void` regenerates last assistant message or specific message by messageId.

**stop**: `() => void` aborts current streaming response.

**clearError**: `() => void` clears error state.

**resumeStream**: `() => void` resumes interrupted streaming response after network error.

**addToolOutput**: `(options: { tool: string; toolCallId: string; output: unknown } | { tool: string; toolCallId: string; state: "output-error", errorText: string }) => void` adds tool result to chat, may trigger automatic submission if sendAutomaticallyWhen configured.

**setMessages**: `(messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[])) => void` updates messages locally without API call for optimistic updates.

### Breaking Changes in AI SDK 5.0
useChat now uses transport-based architecture and no longer manages input state internally. See migration guide for details.