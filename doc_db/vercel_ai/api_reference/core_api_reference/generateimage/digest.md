## generateImage()

Generates images based on a given prompt using an image model. Experimental feature.

### Usage

```ts
import { experimental_generateImage as generateImage } from 'ai';

const { images } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A futuristic cityscape at sunset',
  n: 3,
  size: '1024x1024',
});
```

### Parameters

- `model` (ImageModelV3, required): The image model to use
- `prompt` (string, required): The input prompt to generate the image from
- `n` (number, optional): Number of images to generate
- `size` (string, optional): Size of images in format `{width}x{height}`
- `aspectRatio` (string, optional): Aspect ratio in format `{width}:{height}`
- `seed` (number, optional): Seed for reproducible image generation
- `providerOptions` (ProviderOptions, optional): Additional provider-specific options
- `maxRetries` (number, optional): Maximum number of retries, default 2
- `abortSignal` (AbortSignal, optional): Signal to cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers

### Returns

- `image` (GeneratedFile): The first generated image
- `images` (Array<GeneratedFile>): All generated images
- `warnings` (Warning[]): Warnings from the model provider
- `providerMetadata` (ImageModelProviderMetadata, optional): Provider-specific metadata with an `images` key containing array matching top-level `images` length
- `responses` (Array<ImageModelResponseMetadata>): Response metadata from provider calls, each containing `timestamp`, `modelId`, and optional `headers`

### GeneratedFile Structure

- `base64` (string): Image as base64 encoded string
- `uint8Array` (Uint8Array): Image as Uint8Array
- `mediaType` (string): IANA media type of the image