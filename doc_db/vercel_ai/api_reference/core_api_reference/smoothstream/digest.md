## smoothStream()

A utility function that creates a TransformStream for the `streamText` `transform` option to smooth text streaming by buffering and releasing complete words/lines with configurable delays, creating a more natural reading experience.

### Import
```ts
import { smoothStream } from "ai";
```

### Basic Usage
```ts
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream({
    delayInMs: 20,
    chunking: 'line',
  }),
});
```

### Parameters

**delayInMs** (number | null, optional)
- The delay in milliseconds between outputting each chunk
- Defaults to 10ms
- Set to `null` to disable delays

**chunking** (string | RegExp | function, optional)
- Controls how text is chunked for streaming
- `"word"` - stream word by word (default)
- `"line"` - stream line by line
- RegExp pattern - custom regex-based chunking
- Function - custom callback for chunking

### Chunking Options

**Word chunking limitations with non-latin languages:**
Word-based chunking does not work well with languages that don't delimit words with spaces (Chinese, Japanese, Vietnamese, Thai, Javanese). For these languages, use custom regex or callback functions.

**Chinese example:**
```ts
smoothStream({
  chunking: /[\u4E00-\u9FFF]|\S+\s+/,
})
```

**Japanese example:**
```ts
smoothStream({
  chunking: /[\u3040-\u309F\u30A0-\u30FF]|\S+\s+/,
})
```

**Regex-based chunking:**
```ts
// Split on underscores
smoothStream({
  chunking: /_+/,
});

// Alternative syntax
smoothStream({
  chunking: /[^_]*_/,
});
```

**Custom callback chunking:**
```ts
smoothStream({
  chunking: text => {
    const findString = 'some string';
    const index = text.indexOf(findString);
    if (index === -1) {
      return null;
    }
    return text.slice(0, index) + findString;
  },
})
```

### Returns

Returns a TransformStream that:
- Buffers incoming text chunks
- Releases text when the chunking pattern is encountered
- Adds configurable delays between chunks for smooth output
- Passes through non-text chunks (like step-finish events) immediately