**Issue**: AI SDK 3.0.20+ streams protocol data (`0: "text"`) instead of plain text.

**Fix**: Use `streamText().toTextStreamResponse()` instead of `StreamingTextResponse`, or downgrade to 3.0.19.