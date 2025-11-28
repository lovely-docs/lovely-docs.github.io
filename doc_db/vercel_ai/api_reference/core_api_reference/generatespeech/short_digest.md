## generateSpeech()

Converts text to speech audio using AI providers like OpenAI or ElevenLabs.

**Basic usage:**
```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
  voice: 'alloy',
});
```

**Key parameters:** model (required), text (required), voice, outputFormat, speed, language (ISO 639-1 code or "auto"), instructions, providerOptions, maxRetries, abortSignal, headers

**Returns:** audio object with base64, uint8Array, mimeType, format properties; plus warnings and response metadata

**Status:** Experimental