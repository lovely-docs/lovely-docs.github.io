Reference index for all AI SDK error types. Lists 29 error classes used throughout the library for different failure scenarios:

**API & Network Errors:**
- AI_APICallError: General API call failures
- AI_DownloadError: Download operation failures
- AI_EmptyResponseBodyError: API returned empty response body

**Configuration & Setup Errors:**
- AI_LoadAPIKeyError: Failed to load API key
- AI_LoadSettingError: Failed to load configuration settings
- AI_NoSuchModelError: Specified model not found
- AI_NoSuchProviderError: Specified provider not found

**Input Validation Errors:**
- AI_InvalidArgumentError: Invalid function arguments
- AI_InvalidPromptError: Invalid prompt format or content
- AI_InvalidMessageRoleError: Invalid message role in conversation
- AI_InvalidDataContent: Invalid data content format
- AI_InvalidDataContentError: Data content validation failure
- AI_InvalidToolInputError: Invalid input for tool execution
- AI_InvalidResponseDataError: Invalid response data format
- AI_TypeValidationError: Type validation failure

**Generation Errors:**
- AI_NoContentGeneratedError: Model failed to generate content
- AI_NoImageGeneratedError: Image generation produced no output
- AI_NoSpeechGeneratedError: Speech generation produced no output
- AI_NoTranscriptGeneratedError: Transcription produced no output
- AI_NoObjectGeneratedError: Object generation produced no output

**Processing Errors:**
- AI_JSONParseError: Failed to parse JSON response
- AI_MessageConversionError: Failed to convert message format
- AI_ToolCallRepairError: Failed to repair malformed tool call
- AI_NoSuchToolError: Referenced tool not found
- AI_NoOutputSpecifiedError: No output specification provided

**Retry & Operational Errors:**
- AI_RetryError: Retry operation failed
- AI_TooManyEmbeddingValuesForCallError: Embedding call exceeded value limit
- AI_UnsupportedFunctionalityError: Requested functionality not supported