AI SDK Core provides functions for interacting with language models and AI models.

**Main Functions:**
- `generateText()` - Generate text and call tools from a language model
- `streamText()` - Stream text and call tools from a language model
- `generateObject()` - Generate structured data from a language model
- `streamObject()` - Stream structured data from a language model
- `embed()` - Generate an embedding for a single value using an embedding model
- `embedMany()` - Generate embeddings for several values (batch embedding)
- `experimental_generateImage()` - Generate images based on a prompt
- `experimental_transcribe()` - Generate a transcript from an audio file
- `experimental_generateSpeech()` - Generate speech audio from text

**Helper Functions:**
- `tool()` - Type inference helper for tools
- `experimental_createMCPClient()` - Creates a client for connecting to MCP servers
- `jsonSchema()` - Creates AI SDK compatible JSON schema objects
- `zodSchema()` - Creates AI SDK compatible Zod schema objects
- `createProviderRegistry()` - Creates a registry for using models from multiple providers
- `cosineSimilarity()` - Calculates cosine similarity between two vectors (e.g., embeddings)
- `simulateReadableStream()` - Creates a ReadableStream that emits values with configurable delays
- `wrapLanguageModel()` - Wraps a language model with middleware
- `extractReasoningMiddleware()` - Extracts reasoning from generated text as a `reasoning` property
- `simulateStreamingMiddleware()` - Simulates streaming behavior with non-streaming language models
- `defaultSettingsMiddleware()` - Applies default settings to a language model
- `smoothStream()` - Smooths text streaming output
- `generateId()` - Helper function for generating unique IDs
- `createIdGenerator()` - Creates an ID generator