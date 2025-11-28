## Basic Usage
```ts
const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});
```

Access results via `transcript.text`, `transcript.segments`, `transcript.language`, `transcript.durationInSeconds`.

## Configuration
- **Provider options**: `providerOptions` for model-specific settings
- **Timeout/abort**: `abortSignal: AbortSignal.timeout(1000)`
- **Custom headers**: `headers: { 'X-Custom-Header': 'value' }`

## Error Handling
Throws `NoTranscriptGeneratedError` with `error.cause` and `error.responses` properties.

## Supported Models
OpenAI (whisper-1, gpt-4o-transcribe, gpt-4o-mini-transcribe), ElevenLabs (scribe_v1), Groq (whisper-large-v3-turbo), Azure OpenAI, Rev.ai, Deepgram, Gladia, AssemblyAI, Fal