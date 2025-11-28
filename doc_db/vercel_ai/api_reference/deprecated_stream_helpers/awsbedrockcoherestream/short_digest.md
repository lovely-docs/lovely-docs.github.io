**Deprecated:** Removed in AI SDK 4.0, part of legacy AWS Bedrock integration.

Transforms AWS Bedrock API responses into ReadableStream. Accepts AWSBedrockResponse with optional async iterable body and optional AIStreamCallbacksAndOptions (onStart, onToken, onCompletion, onFinal callbacks). Returns ReadableStream.