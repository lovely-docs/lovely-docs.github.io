Collection of helper functions for streaming AI model responses from various providers.

**Core Streaming Utilities:**
- `AIStream`: Creates a readable stream for AI responses
- `StreamingTextResponse`: Creates a streaming response for text generations
- `streamToResponse`: Pipes a ReadableStream to a Node.js ServerResponse object

**Provider-Specific Stream Transformers:**
- `OpenAIStream`: Transforms OpenAI language model responses into readable streams
- `AnthropicStream`: Transforms Anthropic language model responses into readable streams
- `AWSBedrockStream`: Transforms AWS Bedrock language model responses into readable streams
- `AWSBedrockMessagesStream`: Transforms AWS Bedrock Messages language model responses into readable streams
- `AWSBedrockCohereStream`: Transforms AWS Bedrock Cohere language model responses into readable streams
- `AWSBedrockLlama-2Stream`: Transforms AWS Bedrock Llama-2 language model responses into readable streams
- `CohereStream`: Transforms Cohere language model responses into readable streams
- `GoogleGenerativeAIStream`: Transforms Google language model responses into readable streams
- `HuggingFaceStream`: Transforms Hugging Face language model responses into readable streams
- `LangChainStream`: Transforms LangChain language model responses into readable streams
- `MistralStream`: Transforms Mistral language model responses into readable streams
- `ReplicateStream`: Transforms Replicate language model responses into readable streams
- `InkeepsStream`: Transforms Inkeeps language model responses into readable streams

Each provider-specific helper standardizes the transformation of that provider's response format into a consistent readable stream interface for use in applications.