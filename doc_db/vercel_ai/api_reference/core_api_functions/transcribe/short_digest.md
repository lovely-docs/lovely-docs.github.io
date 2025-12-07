Transcribes audio files to text using a transcription model.

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text, segments, language, durationInSeconds } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  maxRetries: 2, // optional
  abortSignal, // optional
  headers: {}, // optional
});
```

Returns: text, segments (with timing), language, duration, warnings, and response metadata.