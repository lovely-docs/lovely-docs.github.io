## Deprecated Stream Helpers (Removed in AI SDK 4.0)

Legacy utilities for converting LLM provider responses to ReadableStreams, replaced by native providers and `streamText.toDataStreamResponse()`:

- **AIStream**, **StreamingTextResponse**, **streamToResponse**: Core deprecated converters
- **OpenAIStream**, **AnthropicStream**, **MistralStream**, **GoogleGenerativeAIStream**, **AWSBedrockAnthropicMessagesStream**, **AWSBedrockCohereStream**, **ReplicateStream**, **InkeepStream**: Provider-specific deprecated helpers

### Active Adapters
- **@ai-sdk/langchain**: Converts LangChain streams (StringOutputParser, AIMessageChunk, StreamEvents v2) via `toDataStream()`, `toDataStreamResponse()`, `mergeIntoDataStream()`
- **@ai-sdk/llamaindex**: Converts LlamaIndex ChatEngine/QueryEngine streams via same methods