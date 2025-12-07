## Transcription

The `transcribe` function converts audio to text using various models (OpenAI Whisper, Groq, Deepgram, etc.).

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';

const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'), // Uint8Array, Buffer, base64 string, or URL
  providerOptions: { openai: { timestampGranularities: ['word'] } },
  abortSignal: AbortSignal.timeout(1000),
  headers: { 'X-Custom-Header': 'value' },
});

// Results
transcript.text; // transcribed text
transcript.segments; // array with timestamps
transcript.language; // detected language
transcript.durationInSeconds;
transcript.warnings; // unsupported parameters
```

Error handling with `NoTranscriptGeneratedError` provides `error.cause` and `error.responses` metadata. Experimental feature.