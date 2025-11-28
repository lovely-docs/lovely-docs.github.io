## New Features

**OpenTelemetry Support**: Experimental OpenTelemetry support added to all AI SDK Core functions for observability and tracing.

**AI SDK UI Improvements**:
- `useObject` hook (React) for streaming structured data with `streamObject` backend
- `useChat` enhancements: experimental attachments and streaming tool calls support, prevention of empty submissions, fixed `reload` function for proper data/body/headers transmission
- `setThreadId` helper for `useAssistant` to simplify thread management
- Stream data protocol documentation for `useChat` and `useCompletion`, enabling use with any backend and custom frontends with `streamText`
- Custom fetch functions and request body customization support
- `onFinish` callback to `useChat` hook for token usage and finish reason access

**Core Enhancements**:
- Custom request headers support
- Raw JSON schema support alongside Zod
- Usage information for `embed` and `embedMany` functions
- Additional settings: `stopSequences` and `topK` for finer text generation control
- Access to all steps information on `generateText` including intermediate tool calls and results

**New Providers**: AWS Bedrock provider added.

**Provider Improvements**:
- Anthropic, Google, Azure, OpenAI: various improvements and bug fixes
- LangChain adapter: StreamEvent v2 support and `toDataStreamResponse` function for converting LangChain output streams to data stream responses
- OpenAI provider: legacy function calling support
- Mistral AI provider: tool calling support fixes and improvements

**UI Framework Support Expansion**:
- SolidJS: `useChat` and `useCompletion` feature parity with React
- Vue.js: `useAssistant` hook introduced
- Vue.js/Nuxt: updated examples with latest features
- Svelte: tool calling support added to `useChat`

**Fixes and Improvements**: Various race conditions, error handling, and state management issues resolved across SDK components.

**No breaking changes** in this release.