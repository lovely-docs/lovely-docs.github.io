## Overview
`transcribe()` generates transcripts from audio files using transcription models.

## Usage
```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const { text: transcript } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});
```

## Parameters
- **model**: TranscriptionModelV3 to use
- **audio**: Audio file (string, Uint8Array, ArrayBuffer, Buffer, or URL)
- **providerOptions** (optional): Provider-specific options
- **maxRetries** (optional): Default 2
- **abortSignal** (optional): Cancel signal
- **headers** (optional): HTTP headers

## Returns
- **text**: Complete transcribed text
- **segments**: Array of {text, startSecond, endSecond}
- **language**: ISO-639-1 language code
- **durationInSeconds**: Audio duration
- **warnings**: Provider warnings
- **responses**: Response metadata with timestamp, modelId, headers