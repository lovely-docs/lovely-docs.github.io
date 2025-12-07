## smoothStream
TransformStream for `streamText` that smooths text output by buffering and releasing chunks with delays.

**Parameters:**
- `delayInMs` (number | null): delay between chunks, defaults 10ms, null disables
- `chunking` ('word' | 'line' | RegExp | callback): how to split text, defaults 'word'

**Chunking options:**
```ts
// Built-in
smoothStream({ chunking: 'word' });  // default
smoothStream({ chunking: 'line' });

// Regex (e.g., split on underscores)
smoothStream({ chunking: /_+/ });

// Language-specific regex
smoothStream({ chunking: /[\u3040-\u309F\u30A0-\u30FF]|\S+\s+/ }); // Japanese
smoothStream({ chunking: /[\u4E00-\u9FFF]|\S+\s+/ });              // Chinese

// Custom callback
smoothStream({
  chunking: text => {
    const idx = text.indexOf('delimiter');
    return idx === -1 ? null : text.slice(0, idx) + 'delimiter';
  },
});
```

**Returns:** TransformStream that buffers text, releases on chunking pattern, adds delays, passes non-text chunks through immediately.