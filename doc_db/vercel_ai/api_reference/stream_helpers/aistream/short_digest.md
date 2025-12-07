**Deprecated in AI SDK 4.0** (use `streamText.toDataStreamResponse()` instead).

Creates readable stream from fetch response for AI responses. Throws on non-2xx status.

```javascript
import { AIStream } from "ai"

AIStream(response, customParser, {
  onStart: () => Promise<void>,
  onToken: (token: string) => Promise<void>,
  onCompletion: (completion: string) => Promise<void>,
  onFinal: (completion: string) => Promise<void>
})
```

- `customParser`: (data: string) => string | void - parses stream events and extracts message content