Error thrown when image generation fails. Check with `NoImageGeneratedError.isInstance(error)` and access `error.cause` and `error.responses` for details.

```typescript
import { generateImage, NoImageGeneratedError } from 'ai';

try {
  await generateImage({ model, prompt });
} catch (error) {
  if (NoImageGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```