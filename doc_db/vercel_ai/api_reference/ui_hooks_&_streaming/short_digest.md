**useChat** - Conversational UI with streaming, state management, tool calling, transport customization. Returns messages, status, sendMessage, regenerate, stop, addToolOutput, setMessages.

**useCompletion** - Text completion streaming. Returns completion, input, error, isLoading, complete, stop, handlers.

**useObject** (experimental) - Stream and parse JSON to typed objects via schema. Returns submit, object, error, isLoading, stop, clear.

**convertToModelMessages** - Transform useChat messages to ModelMessage; supports multi-modal tool responses and custom data part conversion.

**pruneMessages** - Filter ModelMessage arrays by reasoning/toolCalls/emptyMessages to reduce context.

**createUIMessageStream** - Create readable stream with writer.write/merge, error handling, onFinish callback.

**createUIMessageStreamResponse** - HTTP Response streaming UI chunks (data, text, sources, LLM).

**pipeUIMessageStreamToResponse** - Pipe UIMessageChunk stream to Node.js ServerResponse.

**readUIMessageStream** - Convert UIMessageChunk stream to AsyncIterableStream<UIMessage>.

**InferUITools/InferUITool** - Type helpers mapping tools to input/output types.

React/Svelte/Vue support (Vue lacks useObject).