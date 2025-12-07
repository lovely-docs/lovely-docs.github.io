Generates images from text prompts using image models.

```ts
import { experimental_generateImage as generateImage } from 'ai';

const { images } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A futuristic cityscape at sunset',
  n: 3,
  size: '1024x1024',
});
```

**Parameters**: model, prompt (required); n, size, aspectRatio, seed, providerOptions, maxRetries, abortSignal, headers (optional)

**Returns**: image (first), images (all), warnings, providerMetadata, responses. Each image has base64, uint8Array, mediaType.