

## Pages

### ai_apicallerror
AI_APICallError: error for failed API calls with url, status code, response headers/body, retry status, and detection via APICallError.isInstance()

## AI_APICallError

Error thrown when an API call fails during SDK operations.

### Properties
- `url`: The URL of the failed API request
- `requestBodyValues`: Request body values sent to the API
- `statusCode`: HTTP status code returned by the API
- `responseHeaders`: Response headers from the API
- `responseBody`: Response body from the API
- `isRetryable`: Boolean indicating if the request can be retried based on status code
- `data`: Additional data associated with the error

### Error Detection
Check if an error is an instance of `AI_APICallError`:

```typescript
import { APICallError } from 'ai';

if (APICallError.isInstance(error)) {
  // Handle the error
}
```

### ai_downloaderror
AI_DownloadError: error for failed downloads with url, statusCode, statusText, message properties; detect via DownloadError.isInstance()

## AI_DownloadError

Error thrown when a download operation fails.

### Properties
- `url`: The URL that failed to download
- `statusCode`: HTTP status code returned by the server
- `statusText`: HTTP status text returned by the server
- `message`: Error message with details about the download failure

### Detection
Check if an error is an instance of `AI_DownloadError`:

```typescript
import { DownloadError } from 'ai';

if (DownloadError.isInstance(error)) {
  // Handle the error
}
```

### ai_emptyresponsebodyerror
AI_EmptyResponseBodyError: thrown on empty server response; check with EmptyResponseBodyError.isInstance()

## AI_EmptyResponseBodyError

Error thrown when the server returns an empty response body.

### Properties
- `message`: The error message

### Detection
Check if an error is an instance of this error type:

```typescript
import { EmptyResponseBodyError } from 'ai';

if (EmptyResponseBodyError.isInstance(error)) {
  // Handle the error
}
```

### invalidargumenterror
InvalidArgumentError thrown for invalid arguments; check with isInstance() method; exposes parameter name, value, and message.

## AI_InvalidArgumentError

Thrown when an invalid argument is provided to an AI SDK function.

### Properties
- `parameter`: Name of the invalid parameter
- `value`: The invalid value that was provided
- `message`: Error message describing the issue

### Usage
Check if an error is an instance of `AI_InvalidArgumentError`:

```typescript
import { InvalidArgumentError } from 'ai';

if (InvalidArgumentError.isInstance(error)) {
  // Handle the error
}
```

### invaliddatacontenterror
InvalidDataContentError: thrown for invalid data content in multi-modal messages; detect with isInstance() method; has content and message properties.

## AI_InvalidDataContentError

This error is thrown when invalid data content is provided in a multi-modal message part.

### Properties
- `content`: The invalid content value
- `message`: Error message describing expected vs received content types

### Detection
Check if an error is an instance of this error using:
```typescript
import { InvalidDataContentError } from 'ai';

if (InvalidDataContentError.isInstance(error)) {
  // Handle the error
}
```

For valid multi-modal message formats, refer to the prompt examples documentation.

### ai_invaliddatacontent
AI_InvalidDataContent error with content/message/cause properties; detect via InvalidDataContent.isInstance(error)

## AI_InvalidDataContent Error

This error is thrown when invalid data content is provided to the AI SDK.

### Properties
- `content`: The invalid content value that was provided
- `message`: The error message describing what went wrong
- `cause`: The underlying cause of the error

### Checking for the Error

Use the `isInstance()` method to check if an error is an instance of `AI_InvalidDataContent`:

```typescript
import { InvalidDataContent } from 'ai';

if (InvalidDataContent.isInstance(error)) {
  // Handle the error
}
```

This allows you to differentiate this specific error from other error types and apply appropriate error handling logic.

### invalidmessageroleerror
InvalidMessageRoleError: thrown for invalid message roles; detect with isInstance() method; exposes role and message properties.

## AI_InvalidMessageRoleError

Thrown when an invalid message role is provided to the AI SDK.

### Properties
- `role`: The invalid role value that was provided
- `message`: The error message describing the issue

### Detection
Check if an error is an instance of this error type using the static method:

```typescript
import { InvalidMessageRoleError } from 'ai';

if (InvalidMessageRoleError.isInstance(error)) {
  // Handle the error
}
```

This allows you to distinguish this specific error from other error types and apply appropriate error handling logic.

### ai_invalidprompterror
AI_InvalidPromptError thrown for invalid prompts; typically caused by passing UIMessage[] instead of ModelMessage[] - convert with convertToModelMessages().

## AI_InvalidPromptError

Thrown when an invalid prompt is provided to functions like `streamText` or `generateText`.

### Common Cause: UIMessage[] Instead of ModelMessage[]

The most common cause is passing `UIMessage[]` directly as messages when the function expects `ModelMessage[]`. Convert using `convertToModelMessages()`:

```typescript
import { type UIMessage, generateText, convertToModelMessages } from 'ai';

const messages: UIMessage[] = [/* ... */];

const result = await generateText({
  // ...
  messages: convertToModelMessages(messages),
});
```

### Error Properties

- `prompt`: The invalid prompt value that was rejected
- `message`: Description of what went wrong
- `cause`: The underlying reason for the error

### Checking for the Error

```typescript
import { InvalidPromptError } from 'ai';

if (InvalidPromptError.isInstance(error)) {
  // Handle the error
}
```

### invalidresponsedataerror
InvalidResponseDataError: thrown on invalid server response data; detect via isInstance() method; exposes data and message properties.

## InvalidResponseDataError

Thrown when the server returns a response with invalid data content.

### Properties
- `data`: The invalid response data value
- `message`: The error message

### Detection
Check if an error is an instance of `InvalidResponseDataError`:

```typescript
import { InvalidResponseDataError } from 'ai';

if (InvalidResponseDataError.isInstance(error)) {
  // Handle the error
}
```

### invalidtoolinputerror
InvalidToolInputError: thrown for invalid tool arguments; detect with isInstance(); includes toolName, toolInput, message, cause properties.

## InvalidToolInputError

Thrown when a tool receives invalid input that doesn't match its schema or requirements.

### Properties
- `toolName`: Name of the tool that received invalid input
- `toolInput`: The invalid input data that was provided
- `message`: Error message describing what went wrong
- `cause`: The underlying cause of the validation failure

### Detection
Check if an error is an instance of this error type:

```typescript
import { InvalidToolInputError } from 'ai';

if (InvalidToolInputError.isInstance(error)) {
  // Handle invalid tool input
}
```

This error is typically thrown during tool execution when the provided arguments don't conform to the tool's input schema.

### ai_jsonparseerror
AI_JSONParseError: JSON parse failure error with text and message properties; detect via JSONParseError.isInstance()

## AI_JSONParseError

Error thrown when JSON parsing fails.

### Properties
- `text`: The text value that could not be parsed
- `message`: The error message including parse error details

### Error Detection
Check if an error is an instance of `AI_JSONParseError`:

```typescript
import { JSONParseError } from 'ai';

if (JSONParseError.isInstance(error)) {
  // Handle the error
}
```

### ai_loadapikeyerror
AI_LoadAPIKeyError: error thrown on failed API key loading; detect via LoadAPIKeyError.isInstance()

## AI_LoadAPIKeyError

Error thrown when an API key fails to load successfully.

### Properties
- `message`: The error message describing the failure

### Detection
Check if an error is an instance of `AI_LoadAPIKeyError`:

```typescript
import { LoadAPIKeyError } from 'ai';

if (LoadAPIKeyError.isInstance(error)) {
  // Handle the error
}
```

Use this error handling pattern when working with API key initialization to gracefully manage authentication failures.

### ai_loadsettingerror
AI_LoadSettingError: error for failed setting loads, detected via LoadSettingError.isInstance()

## AI_LoadSettingError

Error thrown when a setting fails to load successfully.

### Properties
- `message`: The error message describing the failure

### Detection
Check if an error is an instance of `AI_LoadSettingError` using the `isInstance()` static method:

```typescript
import { LoadSettingError } from 'ai';

if (LoadSettingError.isInstance(error)) {
  // Handle the error
}
```

### messageconversionerror
MessageConversionError: thrown on message conversion failure; check with isInstance(); has originalMessage and message properties

## MessageConversionError

Error thrown when message conversion fails during SDK operations.

### Properties
- `originalMessage`: The original message that failed conversion
- `message`: The error message describing the failure

### Usage
Check if an error is an instance of `MessageConversionError`:

```typescript
import { MessageConversionError } from 'ai';

if (MessageConversionError.isInstance(error)) {
  // Handle the error
}
```

This error indicates a problem during message transformation or serialization within the SDK.

### nocontentgeneratederror
NoContentGeneratedError: thrown when AI provider fails to generate content; check with isInstance() method

## NoContentGeneratedError

Error thrown when an AI provider fails to generate content.

### Properties
- `message`: The error message

### Usage
Check if an error is an instance of `NoContentGeneratedError`:

```typescript
import { NoContentGeneratedError } from 'ai';

if (NoContentGeneratedError.isInstance(error)) {
  // Handle the error
}
```

### ai_noimagegeneratederror
AI_NoImageGeneratedError: error when image generation fails; check with isInstance(), access cause and responses properties

## AI_NoImageGeneratedError

Error thrown when an AI provider fails to generate an image. Occurs when the model fails to generate a response or generates an invalid response.

### Properties
- `message`: The error message
- `responses`: Metadata about image model responses including timestamp, model, and headers
- `cause`: The underlying cause of the error for detailed error handling

### Usage
Check if an error is an instance of `AI_NoImageGeneratedError` using the `isInstance()` method:

```typescript
import { generateImage, NoImageGeneratedError } from 'ai';

try {
  await generateImage({ model, prompt });
} catch (error) {
  if (NoImageGeneratedError.isInstance(error)) {
    console.log('NoImageGeneratedError');
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

### ai_noobjectgeneratederror
AI_NoObjectGeneratedError: thrown on failed object generation; inspect text, cause, response, usage, finishReason properties; detect with NoObjectGeneratedError.isInstance()

## AI_NoObjectGeneratedError

Thrown when the AI provider fails to generate a parsable object conforming to the provided schema. Common causes include model generation failure, unparseable responses, or schema validation failures.

### Properties
- `message`: Error message
- `text`: Raw or tool call text generated by the model
- `response`: Language model response metadata (id, timestamp, model)
- `usage`: Request token usage
- `finishReason`: Reason request ended (e.g., 'length' if max tokens reached, causing JSON parsing errors)
- `cause`: Underlying error cause for detailed handling (e.g., JSON parsing error)

### Detection
```typescript
import { generateObject, NoObjectGeneratedError } from 'ai';

try {
  await generateObject({ model, schema, prompt });
} catch (error) {
  if (NoObjectGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Text:', error.text);
    console.log('Response:', error.response);
    console.log('Usage:', error.usage);
    console.log('Finish Reason:', error.finishReason);
  }
}
```

### nospeechgeneratederror
NoSpeechGeneratedError: thrown when audio generation fails; detect with isInstance() method; includes responses array and message property.

## NoSpeechGeneratedError

Thrown when audio generation fails to produce any output from the provided input.

### Properties
- `responses`: Array of responses from the generation attempt
- `message`: Error message describing the failure

### Detection
Check if an error is an instance of this error type:

```typescript
import { NoSpeechGeneratedError } from 'ai';

if (NoSpeechGeneratedError.isInstance(error)) {
  // Handle the error
}
```

### nosuchmodelerror
NoSuchModelError: thrown for invalid/missing model IDs; detect with isInstance(); has modelId, modelType, message properties

## NoSuchModelError

Thrown when a model ID cannot be found or resolved by the SDK.

### Properties
- `modelId`: The ID of the model that was not found
- `modelType`: The type of model (e.g., language model, embedding model)
- `message`: The error message describing the failure

### Detection
Check if an error is an instance of `NoSuchModelError`:

```typescript
import { NoSuchModelError } from 'ai';

if (NoSuchModelError.isInstance(error)) {
  // Handle the error
}
```

This error typically occurs when attempting to use a model identifier that doesn't exist in the provider's catalog or hasn't been properly configured.

### ai_nosuchprovidererror
Error thrown when provider ID not found; check with NoSuchProviderError.isInstance(); includes providerId, availableProviders, modelId, modelType properties.

## AI_NoSuchProviderError

Thrown when a provider ID cannot be found in the system.

### Properties
- `providerId`: The ID of the provider that was not found
- `availableProviders`: Array of available provider IDs
- `modelId`: The ID of the model
- `modelType`: The type of model
- `message`: The error message

### Detection
Check if an error is an instance of this error using the static method:

```typescript
import { NoSuchProviderError } from 'ai';

if (NoSuchProviderError.isInstance(error)) {
  // Handle the error
}
```

### ai_nosuchtoolerror
AI_NoSuchToolError: thrown when model calls unavailable tool; detect with isInstance(); includes toolName, availableTools, message properties.

## AI_NoSuchToolError

Thrown when a model attempts to invoke a tool that is not available in the current context.

### Properties
- `toolName`: string - Name of the tool the model tried to call
- `availableTools`: string[] - List of tool names that are actually available
- `message`: string - Error message describing the issue

### Detection
Use the static `isInstance()` method to check if an error is this type:

```typescript
import { NoSuchToolError } from 'ai';

if (NoSuchToolError.isInstance(error)) {
  // Handle the error
}
```

This error indicates a mismatch between the tools provided to the model and the tools it was instructed or configured to call.

### notranscriptgeneratederror
NoTranscriptGeneratedError: thrown when transcript generation fails; check with isInstance(); has responses and message properties

## NoTranscriptGeneratedError

Error thrown when no transcript could be generated from the input.

### Properties
- `responses`: Array of responses
- `message`: The error message

### Checking for the Error

Use the `isInstance()` static method to check if an error is an instance of `NoTranscriptGeneratedError`:

```typescript
import { NoTranscriptGeneratedError } from 'ai';

if (NoTranscriptGeneratedError.isInstance(error)) {
  // Handle the error
}
```

### ai_retryerror
AI_RetryError: error for failed retry operations with reason, lastError, errors array, and message properties; check via RetryError.isInstance()

## AI_RetryError

Error thrown when a retry operation fails after multiple attempts.

### Properties
- `reason`: The reason for the retry failure
- `lastError`: The most recent error that occurred during retries
- `errors`: Array of all errors that occurred during retry attempts
- `message`: The error message

### Type Checking
```typescript
import { RetryError } from 'ai';

if (RetryError.isInstance(error)) {
  // Handle the error
}
```

Use `RetryError.isInstance()` to check if an error is an instance of `AI_RetryError`.

### toomanyembeddingvaluesforcallerror
Error thrown when embedding call exceeds maxEmbeddingsPerCall limit; detect with isInstance() method; properties include provider, modelId, maxEmbeddingsPerCall, values.

## AI_TooManyEmbeddingValuesForCallError

This error is thrown when an embedding call attempts to process more values than the provider's model allows in a single request.

### Error Properties
- `provider`: The AI provider name
- `modelId`: The ID of the embedding model
- `maxEmbeddingsPerCall`: The maximum number of embeddings allowed per call
- `values`: The array of values that was provided

### Detecting the Error
Use the `isInstance()` static method to check if an error is this type:

```typescript
import { TooManyEmbeddingValuesForCallError } from 'ai';

if (TooManyEmbeddingValuesForCallError.isInstance(error)) {
  // Handle the error
}
```

To fix this error, reduce the number of values in your embedding call to be within the `maxEmbeddingsPerCall` limit for your provider and model.

### toolcallrepairerror
ToolCallRepairError: thrown when AI fails to auto-repair invalid tool calls; has originalError, message, cause properties; detect with isInstance()

## ToolCallRepairError

Error thrown when the AI fails to repair an invalid tool call. This occurs when attempting to fix either a `NoSuchToolError` (tool doesn't exist) or `InvalidToolInputError` (tool input is malformed).

### Properties
- `originalError`: The initial error that triggered the repair attempt (`NoSuchToolError` or `InvalidToolInputError`)
- `message`: Error message describing the failure
- `cause`: The underlying error that prevented the repair from succeeding

### Detection
```typescript
import { ToolCallRepairError } from 'ai';

if (ToolCallRepairError.isInstance(error)) {
  // Handle the error
}
```

### typevalidationerror
TypeValidationError: thrown on validation failure; check with isInstance(); has value and message properties

## TypeValidationError

Error thrown when type validation fails during SDK operations.

### Properties
- `value`: The value that failed validation
- `message`: Error message containing validation details

### Usage
Check if an error is a TypeValidationError using the static method:

```typescript
import { TypeValidationError } from 'ai';

if (TypeValidationError.isInstance(error)) {
  // Handle the error
}
```

### ai_unsupportedfunctionalityerror
AI_UnsupportedFunctionalityError: error for unsupported features, check with isInstance(), has functionality and message properties

## AI_UnsupportedFunctionalityError

Error thrown when a requested functionality is not supported by the AI SDK.

### Properties
- `functionality`: string - The name of the unsupported functionality
- `message`: string - The error message describing the issue

### Detection
Check if an error is an instance of this error type:

```typescript
import { UnsupportedFunctionalityError } from 'ai';

if (UnsupportedFunctionalityError.isInstance(error)) {
  // Handle the error
}
```

This allows you to catch and handle cases where the SDK or provider doesn't support a specific feature you're trying to use.

