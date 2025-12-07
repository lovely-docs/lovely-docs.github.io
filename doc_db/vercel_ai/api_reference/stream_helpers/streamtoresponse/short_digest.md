**Deprecated in AI SDK 4.0** (use `pipeDataStreamToResponse` instead).

Pipes a ReadableStream to Node.js ServerResponse with configurable status code and headers (default: 200, `text/plain; charset=utf-8`).

```ts
streamToResponse(
  result.toAIStream({ onFinal() { data.close(); } }),
  res,
  { status: 200, headers: {...} },
  data
);
```

Parameters: stream, response, options (status, headers), data (StreamData).