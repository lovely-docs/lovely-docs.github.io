**DEPRECATED**: StreamingTextResponse has been removed in AI SDK 4.0. Use `streamText.toDataStreamResponse()` instead.

**Purpose**: Utility class that simplifies returning a ReadableStream of text in HTTP responses. Lightweight wrapper around the native Response class.

**Automatic Setup**:
- Status code: 200
- Content-Type header: 'text/plain; charset=utf-8'

**Import**:
```
import { StreamingTextResponse } from "ai"
```

**Parameters**:
1. `stream` (ReadableStream, required): The stream of content representing the HTTP response
2. `init` (ResponseInit, optional): Customize HTTP response properties
   - `status` (number, optional): Status code - StreamingTextResponse overwrites with 200
   - `statusText` (string, optional): Status message for the status code
   - `headers` (HeadersInit, optional): Custom headers - StreamingTextResponse adds 'Content-Type': 'text/plain; charset=utf-8'
3. `data` (StreamData, optional): StreamData object for generating additional response data

**Returns**: Response instance with the provided ReadableStream as body, status 200, and Content-Type header set to 'text/plain; charset=utf-8'. Additional headers and properties can be added via init parameter.