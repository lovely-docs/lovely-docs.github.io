## Image Generation

Generate images from text prompts using `generateImage()` function with various providers and models.

### Basic Usage
```tsx
const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});
```

### Key Features
- **Size/Aspect Ratio**: `size: '1024x1024'` or `aspectRatio: '16:9'`
- **Multiple Images**: `n: 4` with automatic batching; override with `maxImagesPerCall`
- **Reproducibility**: `seed: 1234567890`
- **Provider Options**: `providerOptions: { openai: { style: 'vivid', quality: 'hd' } }`
- **Abort/Timeout**: `abortSignal: AbortSignal.timeout(1000)`
- **Custom Headers**: `headers: { 'X-Custom-Header': 'value' }`
- **Metadata**: Access `warnings` and `providerMetadata` in response
- **Error Handling**: Catch `NoImageGeneratedError`

### Language Model Images
Some models like `gemini-2.5-flash-image-preview` return images via `result.files` with `base64`, `uint8Array`, and `mediaType` properties.

### Supported Models
OpenAI (dall-e-3, dall-e-2, gpt-image-1), Google Vertex (imagen-3.0), Fal (flux variants), DeepInfra (FLUX, Stable Diffusion), Replicate, Amazon Bedrock, and more.