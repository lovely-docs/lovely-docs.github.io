Comprehensive reference of all error types in the SDK. Lists 28 distinct error classes that can be thrown during SDK operations:

**API & Network Errors:**
- AI_APICallError: General API call failures
- AI_DownloadError: Download operation failures
- AI_EmptyResponseBodyError: API returns empty response

**Input Validation Errors:**
- AI_InvalidArgumentError: Invalid function arguments
- AI_InvalidDataContent / AI_InvalidDataContentError: Invalid data content
- AI_InvalidMessageRoleError: Invalid message role in conversation
- AI_InvalidPromptError: Invalid prompt format/content
- AI_InvalidToolInputError: Invalid input to tool

**Configuration & Loading Errors:**
- AI_LoadAPIKeyError: Failed to load API key
- AI_LoadSettingError: Failed to load configuration settings
- AI_NoSuchModelError: Specified model not found
- AI_NoSuchProviderError: Specified provider not found
- AI_NoSuchToolError: Specified tool not found

**Response Processing Errors:**
- AI_InvalidResponseDataError: Invalid response data from API
- AI_JSONParseError: Failed to parse JSON response
- AI_MessageConversionError: Failed to convert message format
- AI_TypeValidationError: Type validation failure

**Generation Errors (no output produced):**
- AI_NoContentGeneratedError: No text content generated
- AI_NoImageGeneratedError: No image generated
- AI_NoSpeechGeneratedError: No speech generated
- AI_NoTranscriptGeneratedError: No transcript generated
- AI_NoObjectGeneratedError: No object generated
- AI_NoOutputSpecifiedError: No output format specified

**Tool & Repair Errors:**
- AI_ToolCallRepairError: Failed to repair tool call
- AI_RetryError: Retry operation failed

**Other Errors:**
- AI_TooManyEmbeddingValuesForCallError: Too many values for embedding call
- AI_UnsupportedFunctionalityError: Unsupported feature used