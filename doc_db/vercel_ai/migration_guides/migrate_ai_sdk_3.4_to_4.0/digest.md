## Migration Process

1. Backup project and commit all changes
2. Migrate to AI SDK 3.4 first
3. Upgrade to AI SDK 4.0
4. Run codemods: `npx @ai-sdk/codemod upgrade` or `npx @ai-sdk/codemod v4`
5. Manually fix remaining breaking changes
6. Verify and commit

## Package Versions

Update to: `ai@4.0.*`, `ai-sdk@provider-utils@2.0.*`, `@ai-sdk/*@1.0.*`

## Provider Changes

- **baseUrl → baseURL**: All providers now use `baseURL` instead of `baseUrl`
- **Anthropic**: Remove `new Anthropic()` facade, use `createAnthropic()` or `anthropic` object. Move model-specific `topK` to standard `topK` parameter
- **Google Generative AI**: Remove `new Google()` facade, use `createGoogleGenerativeAI()` or `google` object. Move model-specific `topK` to standard `topK`
- **Google Vertex**: Move model-specific `topK` to standard `topK`
- **Mistral**: Remove `new Mistral()` facade, use `createMistral()` or `mistral` object
- **OpenAI**: Remove `new OpenAI()` facade, use `createOpenAI()` or `openai` object
- **LangChain**: Replace `LangChainAdapter.toAIStream()` with `LangChainAdapter.toDataStream()`

## AI SDK Core Changes

- **streamText/streamObject**: No longer return Promises - remove `await`
- **Roundtrips → maxSteps**: Replace `maxToolRoundtrips`/`maxAutomaticRoundtrips` with `maxSteps` (value = roundtrips + 1). Replace `roundtrips` property with `steps`
- **nanoid → generateId**: Import `generateId` instead of `nanoid`
- **generateId size**: Now generates 16-character IDs (was 7)
- **Message types**: `ExperimentalMessage` → `ModelMessage`, `ExperimentalUserMessage` → `CoreUserMessage`, `ExperimentalAssistantMessage` → `CoreAssistantMessage`, `ExperimentalToolMessage` → `CoreToolMessage`
- **Tool type**: `ExperimentalTool` → `CoreTool`
- **Experimental exports**: Remove `experimental_generateText`, `experimental_streamText`, `experimental_generateObject`, `experimental_streamObject` - use non-experimental versions
- **streamText methods**: Replace `toAIStream()` with `toDataStream()`, `pipeAIStreamToResponse()` with `pipeDataStreamToResponse()`, `toAIStreamResponse()` with `toDataStreamResponse()`
- **Stream functions**: `formatStreamPart()` → `formatDataStreamPart()`, `parseStreamPart()` → `parseDataStreamPart()`
- **Token usage types**: `TokenUsage`/`CompletionTokenUsage` → `LanguageModelUsage`, `EmbeddingTokenUsage` → `EmbeddingModelUsage`
- **Telemetry**: Removed `ai.finishReason`, `ai.result.object`, `ai.result.text`, `ai.result.toolCalls`, `ai.stream.msToFirstChunk` (now under `ai.response.*`)
- **Provider registry**: Remove `experimental_Provider`, `experimental_ProviderRegistry`, `experimental_ModelRegistry` - use `Provider` instead. Remove `experimental_createModelRegistry()` - use `experimental_createProviderRegistry()`
- **rawResponse → response**: Replace `rawResponse` property with `response`
- **pipeDataStreamToResponse/toDataStreamResponse**: Remove `init` option, set values directly in options object
- **responseMessages**: Replace with `response.messages`
- **experimental_continuationSteps → experimental_continueSteps**
- **LanguageModelResponseMetadataWithHeaders**: Use `LanguageModelResponseMetadata` instead
- **streamText/streamObject warnings**: Now returns Promise - must `await result.warnings`
- **simulateReadableStream**: Rename `values` parameter to `chunks`

## AI SDK RSC Changes

- **render function**: Removed - use `streamUI` instead or migrate to AI SDK UI

## AI SDK UI Changes

- **Framework exports**: Svelte/Vue/SolidJS no longer exported from `ai` - install `@ai-sdk/svelte`, `@ai-sdk/vue`, `@ai-sdk/solid` separately
- **experimental_StreamData → StreamData**
- **useChat hook**:
  - `streamMode` → `streamProtocol`
  - Remove `experimental_maxAutomaticRoundtrips`, `maxAutomaticRoundtrips`, `maxToolRoundtrips` - use `maxSteps` (value = roundtrips + 1)
  - Remove `options` parameter - use `headers` and `body` directly
  - `experimental_addToolResult()` → `addToolResult()`
  - `keepLastMessageOnError` defaults to `true` and is deprecated
- **useCompletion hook**: `streamMode` → `streamProtocol`
- **useAssistant hook**: Remove `experimental_useAssistant` export, use `useAssistant` directly. Remove `threadId` and `messageId` parameters from `AssistantResponse` callback - use outer scope variables. Remove `experimental_AssistantResponse` export
- **useObject hook**: Replace `setInput()` with `submit()`

## AI SDK Errors

- **isXXXError static methods**: Replace `APICallError.isAPICallError(error)` with `APICallError.isInstance(error)`
- **toJSON method**: Removed

## AI SDK 2.x Legacy Removals

- Legacy providers removed - use new provider architecture
- Legacy `function_call` and `tools` options removed from `useChat` and `Message` - use AI SDK Core tool calling
- Prompt helpers removed
- `AIStream` function removed - use `streamText().toDataStream()`
- `StreamingTextResponse` removed - use `streamText().toDataStreamResponse()`
- `streamToResponse` removed - use `streamText().pipeDataStreamToResponse()`
- RSC `Tokens` streaming removed