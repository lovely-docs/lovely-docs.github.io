## Error Types

All errors implement `isInstance()` static method for type checking.

### API & Network Errors
- **APICallError**: Failed API calls with `url`, `statusCode`, `responseHeaders`, `responseBody`, `isRetryable`, `requestBodyValues`
- **DownloadError**: Failed downloads with `url`, `statusCode`, `statusText`
- **LoadAPIKeyError**: API key loading failure
- **LoadSettingError**: Setting loading failure

### Response Errors
- **EmptyResponseBodyError**: Server returned empty response body
- **InvalidResponseDataError**: Server returned invalid response data with `data` property
- **JSONParseError**: JSON parsing failure with `text` property

### Input Validation Errors
- **InvalidArgumentError**: Invalid function argument with `parameter`, `value`
- **InvalidPromptError**: Invalid prompt (common: passing `UIMessage[]` instead of `ModelMessage[]`). Use `convertToModelMessages()` to fix
- **InvalidMessageRoleError**: Invalid message role with `role` property
- **InvalidDataContentError**: Invalid multi-modal message content with `content` property
- **InvalidToolInputError**: Invalid tool arguments with `toolName`, `toolInput`, `cause`
- **TypeValidationError**: Type validation failure with `value` property

### Generation Errors
- **NoContentGeneratedError**: AI provider failed to generate content
- **NoObjectGeneratedError**: Failed object generation with `text`, `response`, `usage`, `finishReason`, `cause`
- **NoImageGeneratedError**: Failed image generation with `responses`, `cause`
- **NoSpeechGeneratedError**: Failed audio generation with `responses`
- **NoTranscriptGeneratedError**: Failed transcript generation with `responses`

### Model & Tool Errors
- **NoSuchModelError**: Model ID not found with `modelId`, `modelType`
- **NoSuchProviderError**: Provider ID not found with `providerId`, `availableProviders`, `modelId`, `modelType`
- **NoSuchToolError**: Model called unavailable tool with `toolName`, `availableTools`
- **ToolCallRepairError**: Failed to auto-repair invalid tool call with `originalError`, `cause`

### Other Errors
- **MessageConversionError**: Message conversion failure with `originalMessage`
- **RetryError**: Retry operation failed with `reason`, `lastError`, `errors` array
- **TooManyEmbeddingValuesForCallError**: Embedding call exceeded limit with `provider`, `modelId`, `maxEmbeddingsPerCall`, `values`
- **UnsupportedFunctionalityError**: Unsupported feature with `functionality`

### Error Detection Pattern
```typescript
import { APICallError, InvalidPromptError } from 'ai';

try {
  // operation
} catch (error) {
  if (APICallError.isInstance(error)) {
    console.log(error.statusCode, error.url);
  } else if (InvalidPromptError.isInstance(error)) {
    console.log(error.cause);
  }
}
```