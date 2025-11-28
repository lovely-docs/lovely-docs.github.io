## Core Functions
- **generateText()** / **streamText()**: Text generation with tools, structured outputs, multi-step workflows
- **generateObject()** / **streamObject()**: Structured data generation from schemas
- **embed()** / **embedMany()**: Embeddings for single/multiple values
- **rerank()**: Document reranking by relevance
- **generateImage()**, **transcribe()**, **generateSpeech()**: Multimodal (experimental)

## Agents & Tools
- **ToolLoopAgent**: Multi-step autonomous agent with tool calling
- **tool()** / **dynamicTool()**: Tool definitions with type inference
- **createAgentUIStream()** / **createAgentUIStreamResponse()** / **pipeAgentUIStreamToResponse()**: Agent output streaming

## MCP
- **experimental_createMCPClient()**: MCP server integration
- **Experimental_StdioMCPTransport**: Stdio transport for MCP

## Schemas & Messages
- **jsonSchema()** / **zodSchema()** / **valibotSchema()**: Schema conversion
- **ModelMessage** / **UIMessage**: Message types with multimodal parts
- **validateUIMessages()** / **safeValidateUIMessages()**: Message validation

## Providers & Middleware
- **createProviderRegistry()** / **customProvider()**: Provider management
- **wrapLanguageModel()**: Model wrapping with middleware
- **extractReasoningMiddleware()** / **simulateStreamingMiddleware()** / **defaultSettingsMiddleware()**: Middleware utilities

## Utilities
- **cosineSimilarity()**: Vector similarity
- **stepCountIs()** / **hasToolCall()**: Stop conditions for tool loops
- **simulateReadableStream()** / **smoothStream()**: Stream utilities
- **generateId()** / **createIdGenerator()**: ID generation