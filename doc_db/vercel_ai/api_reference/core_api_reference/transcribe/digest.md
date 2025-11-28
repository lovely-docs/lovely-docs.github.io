## Overview
`transcribe()` is an experimental function that generates a transcript from an audio file using a transcription model.

## Import
```ts
import { experimental_transcribe as transcribe } from 'ai';
```

## Basic Usage
```ts
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const { text: transcript } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});

console.log(transcript);
```

## Parameters
- **model** (TranscriptionModelV3): The transcription model to use.
- **audio** (DataContent | URL): The audio file to transcribe. Accepts string, Uint8Array, ArrayBuffer, Buffer, or URL.
- **providerOptions** (Record<string, JSONObject>, optional): Additional provider-specific options.
- **maxRetries** (number, optional): Maximum number of retries. Default: 2.
- **abortSignal** (AbortSignal, optional): Signal to cancel the call.
- **headers** (Record<string, string>, optional): Additional HTTP headers for the request.

## Return Value
- **text** (string): The complete transcribed text from the audio input.
- **segments** (Array<{ text: string; startSecond: number; endSecond: number }>): Array of transcript segments with timing information.
- **language** (string | undefined): Language of the transcript in ISO-639-1 format (e.g., "en" for English).
- **durationInSeconds** (number | undefined): Duration of the audio in seconds.
- **warnings** (Warning[]): Warnings from the model provider.
- **responses** (Array<TranscriptionModelResponseMetadata>): Response metadata from the provider, including timestamp, modelId, and optional headers. Multiple responses may be present if multiple calls were made.