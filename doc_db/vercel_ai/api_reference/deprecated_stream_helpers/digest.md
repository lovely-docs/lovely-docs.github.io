## Legacy Stream Conversion Utilities (Removed in AI SDK 4.0)

This directory documents deprecated stream helper functions that have been removed from the AI SDK. These utilities converted various LLM provider responses into ReadableStreams with optional lifecycle callbacks.

### Core Deprecated Helpers
- **AIStream**: Base stream converter accepting Response objects with custom parsers and callbacks (onStart, onToken, onCompletion, onFinal). Replaced by `streamText.toDataStreamResponse()`.
- **StreamingTextResponse**: Wrapper around ReadableStream with automatic status 200 and text/plain Content-Type. Replaced by `streamText.toDataStreamResponse()`.
- **streamToResponse**: Pipes ReadableStream to Node.js ServerResponse with configurable status/headers. Replaced by `pipeDataStreamToResponse`.

### Provider-Specific Deprecated Streams
- **OpenAIStream**: Transforms OpenAI SDK responses to ReadableStream. Use AI SDK OpenAI Provider instead.
- **AnthropicStream**: Converts Anthropic SDK responses to ReadableStream. Use AI SDK Anthropic Provider instead.
- **MistralStream**: Transforms Mistral API responses to ReadableStream. Use AI SDK Mistral Provider instead.
- **GoogleGenerativeAIStream**: Converts Google Generative AI SDK responses to ReadableStream. Use AI SDK Google Generative AI Provider instead.
- **AWSBedrockAnthropicMessagesStream** & **AWSBedrockCohereStream**: Convert AWS Bedrock responses to ReadableStream. Use AI SDK AWS Bedrock Provider instead.
- **ReplicateStream**: Converts Replicate Prediction objects to Promise<ReadableStream>.
- **InkeepStream**: Transforms Inkeep API responses to ReadableStream.

### Framework Adapters (Active)
- **@ai-sdk/langchain**: `toDataStream()`, `toDataStreamResponse()`, `mergeIntoDataStream()` convert LangChain StringOutputParser, AIMessageChunk, and StreamEvents v2 streams to AI SDK data streams.
- **@ai-sdk/llamaindex**: `toDataStream()`, `toDataStreamResponse()`, `mergeIntoDataStream()` convert LlamaIndex ChatEngine and QueryEngine streams to AI SDK data streams.

All deprecated helpers accepted optional callbacks for stream lifecycle events (onStart, onToken, onCompletion, onFinal).