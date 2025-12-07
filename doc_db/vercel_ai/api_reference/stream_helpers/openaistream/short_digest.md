**DEPRECATED in v4.0** - Transforms OpenAI responses into ReadableStream. Use AI SDK OpenAI Provider instead.

**Import**: `import { OpenAIStream } from "ai"`

**API**: `OpenAIStream(response, callbacks?)` with optional callbacks: `onStart()`, `onToken(token)`, `onCompletion(completion)`, `onFinal(completion)`