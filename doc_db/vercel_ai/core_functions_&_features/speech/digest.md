## Overview
The `generateSpeech` function converts text to speech using speech models from various providers. It's currently an experimental feature.

## Basic Usage
```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  voice: 'alloy',
});
const audioData = audio.audioData; // Uint8Array
```

## Language Support
Specify language with the `language` parameter (provider-dependent):
```ts
const audio = await generateSpeech({
  model: lmnt.speech('aurora'),
  text: 'Hola, mundo!',
  language: 'es',
});
```

## Configuration Options

**Provider-Specific Settings**: Use `providerOptions` to pass model-specific configuration:
```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  providerOptions: {
    openai: { /* provider-specific options */ },
  },
});
```

**Abort Signals and Timeouts**: Pass `abortSignal` to abort or timeout:
```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  abortSignal: AbortSignal.timeout(1000),
});
```

**Custom Headers**: Add custom headers via `headers` parameter:
```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

**Warnings**: Access warnings on the `warnings` property for unsupported parameters.

## Error Handling
`generateSpeech` throws `AI_NoSpeechGeneratedError` when generation fails. The error includes:
- `responses`: Metadata about model responses (timestamp, model, headers)
- `cause`: Detailed error cause

```ts
import { experimental_generateSpeech as generateSpeech, NoSpeechGeneratedError } from 'ai';
import { openai } from '@ai-sdk/openai';

try {
  await generateSpeech({
    model: openai.speech('tts-1'),
    text: 'Hello, world!',
  });
} catch (error) {
  if (NoSpeechGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

## Supported Speech Models
- **OpenAI**: tts-1, tts-1-hd, gpt-4o-mini-tts
- **ElevenLabs**: eleven_v3, eleven_multilingual_v2, eleven_flash_v2_5, eleven_flash_v2, eleven_turbo_v2_5, eleven_turbo_v2
- **LMNT**: aurora, blizzard
- **Hume**: default

Additional models available in respective provider documentation.