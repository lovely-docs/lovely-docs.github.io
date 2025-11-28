## Overview
The `transcribe` function converts audio to text using transcription models. It's currently an experimental feature.

## Basic Usage
```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});
```

The `audio` parameter accepts: `Uint8Array`, `ArrayBuffer`, `Buffer`, base64-encoded string, or URL.

## Transcript Output
Access transcript data via properties:
- `text`: The transcribed text (e.g., "Hello, world!")
- `segments`: Array of segments with start/end times (if available)
- `language`: Language code (e.g., "en", if available)
- `durationInSeconds`: Audio duration (if available)
- `warnings`: Array of warnings about unsupported parameters

## Configuration

### Provider-Specific Settings
Use `providerOptions` to pass model-specific parameters:
```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  providerOptions: {
    openai: {
      timestampGranularities: ['word'],
    },
  },
});
```

### Abort Signals and Timeouts
Pass an `abortSignal` to abort or timeout the transcription:
```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  abortSignal: AbortSignal.timeout(1000),
});
```

### Custom Headers
Add custom headers via the `headers` parameter:
```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

## Error Handling
When transcription fails, `AI_NoTranscriptGeneratedError` is thrown. This can occur if the model fails to generate a response or the response cannot be parsed.

The error provides:
- `responses`: Metadata about model responses (timestamp, model, headers)
- `cause`: The underlying error cause

```ts
import { experimental_transcribe as transcribe, NoTranscriptGeneratedError } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

try {
  await transcribe({
    model: openai.transcription('whisper-1'),
    audio: await readFile('audio.mp3'),
  });
} catch (error) {
  if (NoTranscriptGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

## Supported Models
Multiple providers offer transcription models:
- **OpenAI**: `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`
- **ElevenLabs**: `scribe_v1`, `scribe_v1_experimental`
- **Groq**: `whisper-large-v3-turbo`, `distil-whisper-large-v3-en`, `whisper-large-v3`
- **Azure OpenAI**: `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`
- **Rev.ai**: `machine`, `low_cost`, `fusion`
- **Deepgram**: `base`, `enhanced`, `nova`, `nova-2`, `nova-3` (with variants)
- **Gladia**: `default`
- **AssemblyAI**: `best`, `nano`
- **Fal**: `whisper`, `wizper`