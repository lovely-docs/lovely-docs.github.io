## Testing with Mock Providers

Import test utilities from `ai/test`: MockLanguageModelV3, MockEmbeddingModelV3, mockId, mockValues, and simulateReadableStream.

**generateText/generateObject**: Pass MockLanguageModelV3 with doGenerate returning finishReason, usage, and content.

**streamText/streamObject**: Pass MockLanguageModelV3 with doStream returning simulateReadableStream with text-start, text-delta, text-end, and finish chunks.

**UI Message Streams**: Use simulateReadableStream with initialDelayInMs and chunkDelayInMs to simulate server-sent events with proper headers.