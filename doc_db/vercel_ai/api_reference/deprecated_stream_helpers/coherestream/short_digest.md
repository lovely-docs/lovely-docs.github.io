**Deprecated** (removed in AI SDK 4.0). Transforms Cohere API responses into ReadableStream using AIStream with Cohere-specific parser.

**Import**: `import { CohereStream } from "ai"`

**Parameters**: `response` (Response), `callbacks` (optional: onStart, onToken, onCompletion, onFinal)

**Returns**: ReadableStream

**Environments**: Node.js, Edge Runtime, browser