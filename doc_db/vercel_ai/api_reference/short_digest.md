## Core Functions
- `generateText()`, `streamText()`: Text generation with tools and structured outputs
- `generateObject()`, `streamObject()`: Typed object/array/enum generation from schemas
- `embed()`, `embedMany()`, `rerank()`: Embeddings and semantic reranking
- `generateImage()`, `transcribe()`, `generateSpeech()`: Multimodal (experimental)
- `ToolLoopAgent`, `tool()`, `dynamicTool()`: Agent and tool definitions
- `experimental_createMCPClient()`: MCP integration with tool/resource/prompt access
- `jsonSchema()`, `zodSchema()`, `valibotSchema()`: Schema creation/conversion
- `ModelMessage`, `UIMessage`: Message types with multimodal parts
- `createProviderRegistry()`, `customProvider()`: Multi-provider support
- `wrapLanguageModel()`: Middleware for intercepting model calls

## UI Hooks
- `useChat`, `useCompletion`, `useObject`: Streaming UI hooks
- `convertToModelMessages()`, `pruneMessages()`: Message transformation
- `createUIMessageStream()`, `readUIMessageStream()`: Stream creation and consumption

## RSC API
- `streamUI()`: Stream LLM-generated React UI with tools
- `createAI()`, `getAIState()`, `useAIState()`: State management
- `readStreamableValue()`, `useStreamableValue()`: Server-to-client streaming

## Errors
All errors have `isInstance()` for type checking. Categories: API/Network, Response, Input Validation, Generation, Model/Tool, Other.