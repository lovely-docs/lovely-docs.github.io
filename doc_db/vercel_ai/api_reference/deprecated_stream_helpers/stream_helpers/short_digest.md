## Stream Helpers

Utilities for converting AI provider responses into readable streams:

**Core functions:** AIStream (creates readable stream), StreamingTextResponse (HTTP response wrapper), streamToResponse (pipes to Node.js ServerResponse)

**Provider transformers:** OpenAIStream, AnthropicStream, AWSBedrockStream, AWSBedrockMessagesStream, AWSBedrockCohereStream, AWSBedrockLlama-2Stream, CohereStream, GoogleGenerativeAIStream, HuggingFaceStream, LangChainStream, MistralStream, ReplicateStream, InkeepsStream - each converts provider-specific responses to readable streams.