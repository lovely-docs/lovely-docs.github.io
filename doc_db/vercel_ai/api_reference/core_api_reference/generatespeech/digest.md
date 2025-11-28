## generateSpeech()

Generates speech audio from text using various AI providers.

**Import:**
```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
```

**Basic Usage:**
```ts
import { openai } from '@ai-sdk/openai';

const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
  voice: 'alloy',
});
```

**Provider Examples:**

OpenAI:
```ts
const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
  voice: 'alloy',
});
```

ElevenLabs:
```ts
import { elevenlabs } from '@ai-sdk/elevenlabs';

const { audio } = await generateSpeech({
  model: elevenlabs.speech('eleven_multilingual_v2'),
  text: 'Hello from the AI SDK!',
  voice: 'your-voice-id',
});
```

**Parameters:**
- `model` (SpeechModelV3, required): The speech model to use
- `text` (string, required): The text to generate speech from
- `voice` (string, optional): The voice to use for speech
- `outputFormat` (string, optional): Output format (e.g. "mp3", "wav")
- `instructions` (string, optional): Instructions for speech generation
- `speed` (number, optional): Speed of speech generation
- `language` (string, optional): ISO 639-1 language code or "auto" for automatic detection
- `providerOptions` (Record<string, JSONObject>, optional): Provider-specific options
- `maxRetries` (number, optional): Maximum retries, default 2
- `abortSignal` (AbortSignal, optional): Signal to cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers

**Returns:**
- `audio` (GeneratedAudioFile): The generated audio with properties:
  - `base64` (string): Audio as base64 encoded string
  - `uint8Array` (Uint8Array): Audio as Uint8Array
  - `mimeType` (string): MIME type (e.g. "audio/mpeg")
  - `format` (string): Format (e.g. "mp3")
- `warnings` (Warning[]): Warnings from provider
- `responses` (SpeechModelResponseMetadata[]): Response metadata including timestamp, modelId, body, and headers

**Status:** Experimental feature