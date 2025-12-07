## Reading UIMessage Streams

`readUIMessageStream` converts `UIMessageChunk` streams into `AsyncIterableStream<UIMessage>` for processing messages as they construct. Iterate with `for await`, access message parts via `uiMessage.parts`, and handle text/tool-call/tool-result types. Resume conversations by passing a previous `UIMessage` to the `message` parameter.