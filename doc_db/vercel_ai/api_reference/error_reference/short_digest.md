## Error Types

All errors have `isInstance()` static method for type checking.

**API/Network**: APICallError, DownloadError, LoadAPIKeyError, LoadSettingError
**Response**: EmptyResponseBodyError, InvalidResponseDataError, JSONParseError
**Input Validation**: InvalidArgumentError, InvalidPromptError, InvalidMessageRoleError, InvalidDataContentError, InvalidToolInputError, TypeValidationError
**Generation**: NoContentGeneratedError, NoObjectGeneratedError, NoImageGeneratedError, NoSpeechGeneratedError, NoTranscriptGeneratedError
**Model/Tool**: NoSuchModelError, NoSuchProviderError, NoSuchToolError, ToolCallRepairError
**Other**: MessageConversionError, RetryError, TooManyEmbeddingValuesForCallError, UnsupportedFunctionalityError

```typescript
if (APICallError.isInstance(error)) {
  console.log(error.statusCode, error.url);
}
```