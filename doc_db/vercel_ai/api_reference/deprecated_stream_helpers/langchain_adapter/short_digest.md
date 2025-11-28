## API Methods
- **toDataStream**: Converts LangChain streams (StringOutputParser, AIMessageChunk, StreamEvents v2) to AI SDK data stream
- **toDataStreamResponse**: Converts LangChain streams to Response with optional init, data, and callbacks
- **mergeIntoDataStream**: Merges LangChain streams into existing DataStreamWriter

## Examples
Convert LangChain Expression Language or StringOutputParser streams using `toUIMessageStream()` and wrap with `createUIMessageStreamResponse()`