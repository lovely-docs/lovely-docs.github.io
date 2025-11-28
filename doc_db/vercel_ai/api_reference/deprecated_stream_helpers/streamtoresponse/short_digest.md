## Overview
`streamToResponse` pipes a data stream to Node.js `ServerResponse` with configurable status and headers. **Removed in AI SDK 4.0 - use `pipeDataStreamToResponse` instead.**

## Example
```ts
streamToResponse(
  result.toAIStream({ onFinal() { data.close(); } }),
  res,
  { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  data,
);
```

## Parameters
- **stream**: ReadableStream to pipe
- **response**: Node.js ServerResponse object
- **options**: { status?: number, headers?: Record<string, string> }
- **data**: StreamData object for additional client data