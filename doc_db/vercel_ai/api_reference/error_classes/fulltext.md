

## Pages

### apicallerror
APICallError: error class for failed API calls with properties for request/response details and retry status; check with isInstance() method

## AI_APICallError

Error thrown when an API call fails.

### Properties
- `url`: URL of the failed API request
- `requestBodyValues`: Request body values sent to the API
- `statusCode`: HTTP status code returned
- `responseHeaders`: Response headers returned
- `responseBody`: Response body returned
- `isRetryable`: Boolean indicating if request can be retried based on status code
- `data`: Additional data associated with the error

### Checking for this Error

```typescript
import { APICallError } from 'ai';

if (APICallError.isInstance(error)) {
  // Handle the error
}
```

### downloaderror
DownloadError exception with url, statusCode, statusText, message properties; check via DownloadError.isInstance()

## AI_DownloadError

Error thrown when a download fails.

### Properties
- `url`: The URL that failed to download
- `statusCode`: HTTP status code from the server
- `statusText`: HTTP status text from the server
- `message`: Error message with download failure details

### Checking for this Error

```typescript
import { DownloadError } from 'ai';

if (DownloadError.isInstance(error)) {
  // Handle the error
}
```

### emptyresponsebodyerror
EmptyResponseBodyError: thrown on empty server response; detect via isInstance() method

## AI_EmptyResponseBodyError

Thrown when the server returns an empty response body.

### Properties
- `message`: The error message

### Detection
```typescript
import { EmptyResponseBodyError } from 'ai';

if (EmptyResponseBodyError.isInstance(error)) {
  // Handle the error
}
```

### invalidargumenterror
InvalidArgumentError: thrown for invalid function arguments; has parameter, value, message properties; check with isInstance() method.

Error thrown when an invalid argument is provided to an API function.

**Properties:**
- `parameter`: Name of the invalid parameter
- `value`: The invalid value that was provided
- `message`: Error message describing the issue

**Type checking:**
```typescript
import { InvalidArgumentError } from 'ai';

if (InvalidArgumentError.isInstance(error)) {
  // Handle the error
}
```

### invaliddatacontenterror
InvalidDataContentError: thrown for invalid data content in multi-modal message parts; detect with isInstance() method; provides content and message properties.

Error thrown when multi-modal message data content is invalid.

**Properties:**
- `content`: The invalid content value
- `message`: Error message describing expected vs received content types

**Detection:**
```typescript
import { InvalidDataContentError } from 'ai';

if (InvalidDataContentError.isInstance(error)) {
  // Handle the error
}
```

Occurs when providing invalid data content in multi-modal message parts. Refer to prompt examples for multi-modal messages for valid content formats.

### invaliddatacontent_error
AI_InvalidDataContent error reference: thrown on invalid data content; detect with isInstance() method; exposes content, message, and cause properties.

## AI_InvalidDataContent Error

Thrown when invalid data content is provided to the SDK.

### Properties
- `content`: The invalid content value
- `message`: The error message
- `cause`: The cause of the error

### Detection
```typescript
import { InvalidDataContent } from 'ai';

if (InvalidDataContent.isInstance(error)) {
  // Handle the error
}
```

### invalidmessageroleerror
InvalidMessageRoleError: thrown for invalid message roles; detect with isInstance() method; exposes role and message properties

## AI_InvalidMessageRoleError

Thrown when an invalid message role is provided to the AI SDK.

### Properties
- `role`: The invalid role value that was provided
- `message`: The error message describing the issue

### Detection
Check if an error is an instance of this error type:

```typescript
import { InvalidMessageRoleError } from 'ai';

if (InvalidMessageRoleError.isInstance(error)) {
  // Handle the error
}
```

### invalidprompterror
AI_InvalidPromptError: thrown for invalid prompts; typically caused by passing UIMessage[] instead of ModelMessage[] - convert with convertToModelMessages()

## AI_InvalidPromptError

Thrown when an invalid prompt is provided to functions like `streamText` or `generateText`.

### Common Cause: UIMessage[] Instead of ModelMessage[]

The most common cause is passing `UIMessage[]` directly instead of converting to `ModelMessage[]` first.

**Solution:** Use `convertToModelMessages()` to convert:

```typescript
import { type UIMessage, generateText, convertToModelMessages } from 'ai';

const messages: UIMessage[] = [/* ... */];
const result = await generateText({
  // ...
  messages: convertToModelMessages(messages),
});
```

### Error Properties

- `prompt`: The invalid prompt value
- `message`: The error message
- `cause`: The underlying cause

### Type Checking

```typescript
import { InvalidPromptError } from 'ai';

if (InvalidPromptError.isInstance(error)) {
  // Handle the error
}
```

### invalidresponsedataerror
InvalidResponseDataError: thrown on invalid server response data; check with isInstance(); has data and message properties

Error thrown when the server returns a response with invalid data content.

**Properties:**
- `data`: The invalid response data value
- `message`: The error message

**Type checking:**
```typescript
import { InvalidResponseDataError } from 'ai';

if (InvalidResponseDataError.isInstance(error)) {
  // Handle the error
}
```

### invalidtoolinputerror
InvalidToolInputError: error for invalid tool input; check with isInstance(); has toolName, toolInput, message, cause properties

## AI_InvalidToolInputError

Thrown when a tool receives invalid input.

### Properties
- `toolName`: Name of the tool with invalid inputs
- `toolInput`: The invalid tool inputs
- `message`: Error message
- `cause`: Cause of the error

### Detection
```typescript
import { InvalidToolInputError } from 'ai';

if (InvalidToolInputError.isInstance(error)) {
  // Handle the error
}
```

### jsonparseerror
JSONParseError: thrown on JSON parse failure; check with isInstance(); has text and message properties

Error thrown when JSON parsing fails.

**Properties:**
- `text`: The text value that could not be parsed
- `message`: Error message including parse error details

**Checking for this error:**
```typescript
import { JSONParseError } from 'ai';

if (JSONParseError.isInstance(error)) {
  // Handle the error
}
```

### loadapikeyerror
LoadAPIKeyError thrown on failed API key loading; detect via isInstance() method.

Error thrown when API key fails to load successfully.

**Properties:**
- `message`: The error message

**Detection:**
```typescript
import { LoadAPIKeyError } from 'ai';

if (LoadAPIKeyError.isInstance(error)) {
  // Handle the error
}
```

### loadsettingerror
LoadSettingError: thrown on failed setting load; detect via LoadSettingError.isInstance()

## AI_LoadSettingError

Error thrown when a setting fails to load successfully.

### Properties
- `message`: The error message

### Detection
Check if an error is an instance of this error type:

```typescript
import { LoadSettingError } from 'ai';

if (LoadSettingError.isInstance(error)) {
  // Handle the error
}
```

### messageconversionerror
MessageConversionError thrown on message conversion failure; detect via isInstance() method; exposes originalMessage and message properties.

Error thrown when message conversion fails during processing.

**Properties:**
- `originalMessage`: The original message that failed conversion
- `message`: The error message

**Detection:**
```typescript
import { MessageConversionError } from 'ai';

if (MessageConversionError.isInstance(error)) {
  // Handle the error
}
```

### nocontentgeneratederror
NoContentGeneratedError: thrown when AI provider fails to generate content; check with isInstance() method.

Error thrown when an AI provider fails to generate content.

**Properties:**
- `message`: The error message

**Detection:**
```typescript
import { NoContentGeneratedError } from 'ai';

if (NoContentGeneratedError.isInstance(error)) {
  // Handle the error
}
```

### noimagegeneratederror
NoImageGeneratedError: thrown on image generation failure; check with isInstance(); provides message, responses metadata, and cause

## AI_NoImageGeneratedError

Thrown when an image generation provider fails to generate an image, either because the model failed to generate a response or generated an invalid response.

### Properties
- `message`: Error message
- `responses`: Metadata about image model responses (timestamp, model, headers)
- `cause`: Root cause for detailed error handling

### Usage
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

Check error type with `NoImageGeneratedError.isInstance(error)` to access error-specific properties.

### noobjectgeneratederror
NoObjectGeneratedError: thrown when generateObject() fails to produce parsable schema-conforming object; properties include text, response metadata, usage, finishReason, and cause; check with isInstance().

## AI_NoObjectGeneratedError

Thrown when `generateObject()` fails to produce a parsable object matching the provided schema.

**Causes:**
- Model failed to generate a response
- Generated response couldn't be parsed
- Generated response failed schema validation

**Properties:**
- `message`: Error message
- `text`: Raw or tool call text generated by model
- `response`: Language model response metadata (id, timestamp, model)
- `usage`: Request token usage
- `finishReason`: Why generation stopped (e.g., 'length' if max tokens reached, causing JSON parse failure)
- `cause`: Underlying error for detailed handling (e.g., JSON parsing error)

**Usage:**
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
NoSpeechGeneratedError: thrown when audio generation fails; detect via isInstance() method; includes responses array and message property.

## NoSpeechGeneratedError

Thrown when audio generation fails to produce any output from the provided input.

### Properties
- `responses`: Array of responses
- `message`: Error message string

### Detection
```typescript
import { NoSpeechGeneratedError } from 'ai';

if (NoSpeechGeneratedError.isInstance(error)) {
  // Handle error
}
```

### nosuchmodelerror
NoSuchModelError thrown when model ID not found; detect with isInstance() method; exposes modelId, modelType, message properties.

## AI_NoSuchModelError

Thrown when a model ID cannot be found.

### Properties
- `modelId`: The ID of the model that was not found
- `modelType`: The type of model
- `message`: The error message

### Detection
```typescript
import { NoSuchModelError } from 'ai';

if (NoSuchModelError.isInstance(error)) {
  // Handle the error
}
```

### nosuchprovidererror
NoSuchProviderError thrown when provider ID not found; detect with isInstance() method; includes providerId, availableProviders, modelId, modelType properties.

Error thrown when a provider ID is not found in the system.

**Properties:**
- `providerId`: The ID of the provider that was not found
- `availableProviders`: Array of available provider IDs
- `modelId`: The ID of the model
- `modelType`: The type of model
- `message`: The error message

**Detection:**
```typescript
import { NoSuchProviderError } from 'ai';

if (NoSuchProviderError.isInstance(error)) {
  // Handle the error
}
```

### nosuchtoolerror
NoSuchToolError: thrown when model calls non-existent tool; detect via isInstance() method; includes toolName, availableTools, message properties.

Error thrown when a model attempts to call a tool that is not available in the current context.

**Properties:**
- `toolName`: Name of the tool that was not found
- `availableTools`: Array of available tool names
- `message`: Error message

**Detection:**
```typescript
import { NoSuchToolError } from 'ai';

if (NoSuchToolError.isInstance(error)) {
  // Handle the error
}
```

### notranscriptgeneratederror
NoTranscriptGeneratedError thrown when transcript generation fails; check with isInstance() method; includes responses array and message properties.

Error thrown when no transcript could be generated from the input.

**Properties:**
- `responses`: Array of responses
- `message`: The error message

**Checking for the error:**
```typescript
import { NoTranscriptGeneratedError } from 'ai';

if (NoTranscriptGeneratedError.isInstance(error)) {
  // Handle the error
}
```

### retryerror
RetryError: thrown on failed retry operations; check with isInstance(); provides reason, lastError, errors array, and message properties

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

### toomanyembeddingvaluesforcallerror
Error thrown when embedding call exceeds provider's maxEmbeddingsPerCall limit; detect with isInstance() method.

## Error Overview
`AI_TooManyEmbeddingValuesForCallError` is thrown when attempting to embed more values in a single call than the provider's model allows.

## Error Properties
- `provider`: The AI provider name
- `modelId`: The embedding model identifier
- `maxEmbeddingsPerCall`: Maximum embeddings allowed per call
- `values`: The array of values that exceeded the limit

## Detection
```typescript
import { TooManyEmbeddingValuesForCallError } from 'ai';

if (TooManyEmbeddingValuesForCallError.isInstance(error)) {
  // Handle the error
}
```

### toolcallrepairerror
ToolCallRepairError: thrown when AI fails to repair NoSuchToolError or InvalidToolInputError; check with isInstance(); has originalError, message, cause properties.

## ToolCallRepairError

Occurs when the AI fails to repair an invalid tool call. This error is triggered when the AI attempts to fix either a `NoSuchToolError` or `InvalidToolInputError`, but the repair attempt itself fails.

### Properties
- `originalError`: The original error that triggered the repair (either `NoSuchToolError` or `InvalidToolInputError`)
- `message`: The error message
- `cause`: The underlying error that caused the repair to fail

### Detection
```typescript
import { ToolCallRepairError } from 'ai';

if (ToolCallRepairError.isInstance(error)) {
  // Handle the error
}
```

### typevalidationerror
TypeValidationError: thrown on validation failure; detect with isInstance(); has value and message properties

## AI_TypeValidationError

Thrown when type validation fails during SDK operations.

### Properties
- `value`: The value that failed validation
- `message`: Error message with validation details

### Detection
```typescript
import { TypeValidationError } from 'ai';

if (TypeValidationError.isInstance(error)) {
  // Handle the error
}
```

### unsupportedfunctionalityerror
UnsupportedFunctionalityError: thrown for unsupported features, detectable via isInstance() method, contains functionality name and message

## AI_UnsupportedFunctionalityError

Thrown when a feature is not supported by the SDK.

### Properties
- `functionality`: name of the unsupported feature
- `message`: error message

### Detection
```typescript
import { UnsupportedFunctionalityError } from 'ai';

if (UnsupportedFunctionalityError.isInstance(error)) {
  // Handle the error
}
```

