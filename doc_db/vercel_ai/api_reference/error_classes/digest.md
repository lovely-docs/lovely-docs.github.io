## Error Classes Reference

Comprehensive set of error classes thrown by the AI SDK. All errors support type checking via `ErrorClass.isInstance(error)` method.

### API & Network Errors
- **APICallError**: Failed API calls with `url`, `requestBodyValues`, `statusCode`, `responseHeaders`, `responseBody`, `isRetryable`, `data` properties
- **DownloadError**: Download failures with `url`, `statusCode`, `statusText`, `message`
- **EmptyResponseBodyError**: Server returned empty response body
- **LoadAPIKeyError**: API key loading failed
- **LoadSettingError**: Setting loading failed

### Data Validation Errors
- **InvalidArgumentError**: Invalid function argument with `parameter`, `value`, `message`
- **InvalidDataContentError**: Invalid multi-modal message content with `content`, `message`
- **InvalidDataContent**: Invalid data content with `content`, `message`, `cause`
- **InvalidMessageRoleError**: Invalid message role with `role`, `message`
- **InvalidPromptError**: Invalid prompt (common cause: passing `UIMessage[]` instead of `ModelMessage[]`). Solution: use `convertToModelMessages()` to convert. Properties: `prompt`, `message`, `cause`
- **InvalidResponseDataError**: Server response with invalid data with `data`, `message`
- **InvalidToolInputError**: Tool received invalid input with `toolName`, `toolInput`, `message`, `cause`
- **TypeValidationError**: Type validation failed with `value`, `message`

### Generation Errors
- **NoContentGeneratedError**: AI provider failed to generate content
- **NoImageGeneratedError**: Image generation failed with `message`, `responses` (metadata), `cause`
- **NoObjectGeneratedError**: `generateObject()` failed to produce schema-conforming object. Properties: `message`, `text` (raw generated), `response` (metadata), `usage`, `finishReason`, `cause`. Causes: model failed, response unparseable, or failed schema validation
- **NoSpeechGeneratedError**: Audio generation failed with `responses`, `message`
- **NoTranscriptGeneratedError**: Transcript generation failed with `responses`, `message`

### Model & Provider Errors
- **NoSuchModelError**: Model ID not found with `modelId`, `modelType`, `message`
- **NoSuchProviderError**: Provider ID not found with `providerId`, `availableProviders`, `modelId`, `modelType`, `message`
- **NoSuchToolError**: Model called non-existent tool with `toolName`, `availableTools`, `message`
- **TooManyEmbeddingValuesForCallError**: Embedding call exceeded provider's `maxEmbeddingsPerCall` limit with `provider`, `modelId`, `maxEmbeddingsPerCall`, `values`

### Parsing & Conversion Errors
- **JSONParseError**: JSON parsing failed with `text`, `message`
- **MessageConversionError**: Message conversion failed with `originalMessage`, `message`

### Retry & Repair Errors
- **RetryError**: Retry operation failed after multiple attempts with `reason`, `lastError`, `errors` (array of all errors), `message`
- **ToolCallRepairError**: AI failed to repair `NoSuchToolError` or `InvalidToolInputError` with `originalError`, `message`, `cause`

### Other Errors
- **UnsupportedFunctionalityError**: Feature not supported with `functionality`, `message`

### Usage Pattern
```typescript
import { APICallError, InvalidPromptError, NoObjectGeneratedError } from 'ai';

try {
  await generateObject({ model, schema, messages: convertToModelMessages(uiMessages) });
} catch (error) {
  if (APICallError.isInstance(error)) {
    console.log('API failed:', error.statusCode, error.isRetryable);
  } else if (InvalidPromptError.isInstance(error)) {
    console.log('Invalid prompt:', error.cause);
  } else if (NoObjectGeneratedError.isInstance(error)) {
    console.log('Generation failed:', error.cause, error.finishReason);
  }
}
```