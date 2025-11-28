## Core Concepts

**Generative AI**: Models that predict and generate outputs (text, images, audio) based on statistical patterns. LLMs predict text sequences but can hallucinate when information is absent from training data. Embedding models convert data into dense vector representations for semantic relationships.

## Providers & Models

The AI SDK provides a standardized interface across 50+ LLM providers (25+ official, OpenAI-compatible, and 25+ community providers). Official providers include OpenAI, Anthropic, Google, Mistral, Groq, xAI, and others. Models support varying capabilities: image input, object generation, tool usage, and tool streaming.

## Prompts

Three prompt types:
- **Text prompts**: Simple strings with template literals
- **System prompts**: Initial instructions guiding model behavior
- **Message prompts**: Arrays of user/assistant/tool messages for chat interfaces

Multi-modal content supports text, images (base64, binary, URL), and files (PDF, audio). Provider-specific options can be set at function, message, or message-part levels.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You help planning travel itineraries.',
  messages: [
    { role: 'user', content: [
      { type: 'text', text: 'Describe the image.' },
      { type: 'image', image: fs.readFileSync('./image.png') }
    ]},
    { role: 'assistant', content: [
      { type: 'tool-call', toolCallId: '123', toolName: 'search', input: { query: 'Berlin' }}
    ]},
    { role: 'tool', content: [
      { type: 'tool-result', toolCallId: '123', toolName: 'search', output: { type: 'json', value: {...}}}
    ]}
  ],
  providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' }}}
});
```

## Tools

Tools are LLM-callable objects with `description`, `inputSchema` (Zod or JSON), and optional `execute` function. Pass to `generateText` or `streamText` via the `tools` parameter. Tools can be packaged and distributed via npm.

```ts
import z from 'zod';

const myTool = {
  description: 'Search the web',
  inputSchema: z.object({ query: z.string() }),
  execute: async ({ query }) => { /* ... */ }
};

const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'When was Vercel Ship AI?',
  tools: { webSearch: myTool }
});
```

Ready-to-use tool packages: web search (@exalabs/ai-sdk), Stripe, Composio (250+ tools), AWS Bedrock (Browser, Code Interpreter), MCP servers (Smithery 6000+, Pipedream 3000+).

## Streaming

`streamText` displays LLM response chunks incrementally instead of waiting for complete generation. The `textStream` is an async iterable yielding text chunks as generated.

```ts
const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a poem about embedding models.'
});

for await (const textPart of textStream) {
  console.log(textPart);
}
```