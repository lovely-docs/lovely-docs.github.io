## Speech Generation
Convert text to speech using `generateSpeech` with various providers (OpenAI, ElevenLabs, LMNT, Hume).

```ts
const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  voice: 'alloy',
  language: 'es', // optional
  abortSignal: AbortSignal.timeout(1000),
  headers: { 'X-Custom-Header': 'value' },
  providerOptions: { openai: { /* ... */ } },
});
const audioData = audio.audioData; // Uint8Array
```

**Error Handling**: Throws `AI_NoSpeechGeneratedError` with `responses` and `cause` properties.

**Supported Models**: OpenAI (tts-1, tts-1-hd, gpt-4o-mini-tts), ElevenLabs (eleven_v3, eleven_multilingual_v2, eleven_flash_v2_5, eleven_flash_v2, eleven_turbo_v2_5, eleven_turbo_v2), LMNT (aurora, blizzard), Hume (default).