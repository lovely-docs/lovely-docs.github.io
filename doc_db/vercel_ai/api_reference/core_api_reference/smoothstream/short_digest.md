## smoothStream()

Creates a TransformStream for `streamText` to smooth text output by buffering and releasing chunks with configurable delays.

### Basic Usage
```ts
streamText({
  model,
  prompt,
  experimental_transform: smoothStream({
    delayInMs: 20,
    chunking: 'line',
  }),
})
```

### Parameters
- **delayInMs** (number | null): Delay between chunks in ms, defaults to 10ms, set to null to disable
- **chunking** ("word" | "line" | RegExp | function): How to chunk text - word (default), line, regex pattern, or custom callback

### Non-Latin Language Support
Word chunking doesn't work for languages without space delimiters (Chinese, Japanese, Vietnamese, Thai, Javanese). Use custom regex or callbacks instead:

```ts
// Chinese
smoothStream({ chunking: /[\u4E00-\u9FFF]|\S+\s+/ })

// Japanese
smoothStream({ chunking: /[\u3040-\u309F\u30A0-\u30FF]|\S+\s+/ })

// Custom regex (split on underscores)
smoothStream({ chunking: /_+/ })

// Custom callback
smoothStream({
  chunking: text => {
    const index = text.indexOf('some string');
    return index === -1 ? null : text.slice(0, index) + 'some string';
  }
})
```

### Returns
TransformStream that buffers text, releases on chunking pattern, adds delays, and passes through non-text chunks immediately.