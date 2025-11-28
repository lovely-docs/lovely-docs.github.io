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