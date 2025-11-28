## useChat Hook

Conversational UI hook with streaming support, state management, and automatic updates.

### Key Parameters
- **transport**: Customize API endpoint, headers, credentials, request preparation
- **onToolCall**: Handle tool calls, must call addToolOutput with result
- **sendAutomaticallyWhen**: Auto-resubmit messages after stream finish or tool call
- **onFinish**: Callback with message, all messages, abort/disconnect/error flags, finish reason
- **experimental_throttle**: Throttle updates in ms

### Key Returns
- **messages**: UIMessage[] with id, role, parts, metadata
- **status**: 'submitted' | 'streaming' | 'ready' | 'error'
- **sendMessage**: Send message with optional headers/body/data
- **regenerate**: Regenerate last or specific message by messageId
- **stop**: Abort streaming
- **resumeStream**: Resume after network error
- **addToolOutput**: Add tool result, triggers auto-submission if configured
- **setMessages**: Optimistic local updates

### Breaking Change (SDK 5.0)
Transport-based architecture, no internal input state management.