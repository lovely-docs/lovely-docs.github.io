## Basic Usage
```tsx
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});
```

## Key Features
- **Size/Aspect Ratio**: `size: '1024x1024'` or `aspectRatio: '16:9'` (model-dependent)
- **Multiple Images**: `n: 4` with automatic batching; override with `maxImagesPerCall`
- **Reproducibility**: `seed: 1234567890` (if supported)
- **Provider Options**: `providerOptions: { openai: { style: 'vivid', quality: 'hd' } }`
- **Control**: `abortSignal`, `headers`, `warnings`, `providerMetadata`
- **Error Handling**: Catch `NoImageGeneratedError` with `error.cause` and `error.responses`
- **Language Model Images**: Some models like `gemini-2.5-flash-image-preview` return images via `result.files` with `base64`, `uint8Array`, `mediaType`
- **Supported Providers**: OpenAI, Google, Fal, DeepInfra, Replicate, Amazon Bedrock, Fireworks, Luma, Together.ai, Black Forest Labs, xAI Grok