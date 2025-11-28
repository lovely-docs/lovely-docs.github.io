## Stream Helpers Reference

Collection of utility functions for transforming AI provider responses into readable streams for streaming text generations.

### Core Streaming Functions

**AIStream** - Creates a readable stream for AI responses from any provider.

**StreamingTextResponse** - Wraps a stream into an HTTP response object for streaming text generations to clients.

**streamToResponse** - Pipes a ReadableStream to a Node.js ServerResponse object for server-side streaming.

### Provider-Specific Stream Transformers

Transform responses from various AI providers into readable streams:

- **OpenAIStream** - Transforms OpenAI language model responses
- **AnthropicStream** - Transforms Anthropic language model responses
- **AWSBedrockStream** - Transforms AWS Bedrock language model responses
- **AWSBedrockMessagesStream** - Transforms AWS Bedrock Messages API responses
- **AWSBedrockCohereStream** - Transforms AWS Bedrock Cohere model responses
- **AWSBedrockLlama-2Stream** - Transforms AWS Bedrock Llama-2 model responses
- **CohereStream** - Transforms Cohere language model responses
- **GoogleGenerativeAIStream** - Transforms Google language model responses
- **HuggingFaceStream** - Transforms Hugging Face language model responses
- **LangChainStream** - Transforms LangChain language model responses
- **MistralStream** - Transforms Mistral language model responses
- **ReplicateStream** - Transforms Replicate language model responses
- **InkeepsStream** - Transforms Inkeeps language model responses

Each provider-specific stream transformer converts that provider's native response format into a standardized readable stream format compatible with the library's streaming infrastructure.