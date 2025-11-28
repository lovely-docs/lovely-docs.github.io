

## Pages

### overview
Foundational AI concepts: generative models produce outputs from patterns; LLMs predict text sequences but can hallucinate; embeddings convert data to semantic vectors.

The AI SDK standardizes integration with AI models across multiple providers, allowing developers to focus on building applications rather than handling provider-specific details.

**Generative Artificial Intelligence**: Models that predict and generate outputs (text, images, audio) based on statistical patterns learned from training data. Examples: generating image captions from photos, transcriptions from audio, or images from text descriptions.

**Large Language Models (LLMs)**: A subset of generative models focused on text. Takes a sequence of words as input and predicts the most likely sequence to follow by assigning probabilities to potential next sequences. Continues generating until a stopping criterion is met. LLMs train on massive text collections, making them better suited for some use cases than others (e.g., a model trained on GitHub data understands source code patterns well). Important limitation: LLMs can "hallucinate" or fabricate information when asked about less-known or absent information, so consider how well-represented your needed information is in the model's training data.

**Embedding Models**: Convert complex data (words, images) into dense vector representations (lists of numbers). Unlike generative models, they don't generate new text or data but provide representations of semantic and syntactic relationships between entities for use as input to other models or NLP tasks.

### providers_and_models
Standardized interface for 50+ LLM providers (official, OpenAI-compatible, community) with capability matrix for 40+ models across image input, object generation, tool usage, and streaming.

## Overview

The AI SDK provides a standardized interface for interacting with large language models (LLMs) from different providers through a unified language model specification. This abstraction layer eliminates vendor lock-in and allows switching between providers without changing application code.

## Architecture

The AI SDK uses a language model specification (published as open-source) that abstracts provider differences, enabling the same API to work across all providers.

## Official Providers

The SDK includes 25+ official providers:

- **LLM Providers**: xAI Grok, OpenAI, Azure OpenAI, Anthropic, Amazon Bedrock, Google Generative AI, Google Vertex, Mistral, Together.ai, Cohere, Fireworks, DeepInfra, DeepSeek, Cerebras, Groq, Perplexity
- **Specialized Providers**: ElevenLabs, LMNT, Hume, Rev.ai, Deepgram, Gladia, AssemblyAI, Baseten, Vercel

## OpenAI-Compatible Providers

For APIs compatible with OpenAI specification:
- LM Studio
- Heroku

## Community Providers

The open-source community has created 25+ additional providers including: Ollama, FriendliAI, Portkey, Cloudflare Workers AI, OpenRouter, Aihubmix, Requesty, Crosshatch, Mixedbread, Voyage AI, Mem0, Letta, Supermemory, Spark, AnthropicVertex, LangDB, Dify, Sarvam, Claude Code, Built-in AI, Gemini CLI, A2A, SAP-AI, AI/ML API, MCP Sampling, ACP.

## Self-Hosted Models

Access self-hosted models through: Ollama, LM Studio, Baseten, Built-in AI, or any provider supporting OpenAI specification.

## Model Capabilities

Popular models support varying capabilities:

| Provider | Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----------|-------|-------------|-------------------|------------|----------------|
| xAI Grok | grok-4, grok-3, grok-3-fast, grok-3-mini, grok-3-mini-fast, grok-2-1212 | ✗ | ✓ | ✓ | ✓ |
| xAI Grok | grok-2-vision-1212, grok-vision-beta | ✓ | ✓/✗ | ✓/✗ | ✓/✗ |
| OpenAI | gpt-5, gpt-5-mini, gpt-5-nano, gpt-5.1-chat-latest, gpt-5.1-codex-mini, gpt-5.1-codex, gpt-5.1, gpt-5-codex, gpt-5-chat-latest | ✓ | ✓ | ✓ | ✓ |
| Anthropic | claude-opus-4-5, claude-opus-4-1, claude-opus-4-0, claude-sonnet-4-0, claude-3-7-sonnet-latest, claude-3-5-haiku-latest | ✓ | ✓ | ✓ | ✓ |
| Mistral | pixtral-large-latest, mistral-large-latest, mistral-medium-latest, mistral-medium-2505, mistral-small-latest, pixtral-12b-2409 | ✓/✗ | ✓ | ✓ | ✓ |
| Google Generative AI | gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro | ✓ | ✓ | ✓ | ✓ |
| Google Vertex | gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro | ✓ | ✓ | ✓ | ✓ |
| DeepSeek | deepseek-chat, deepseek-reasoner | ✗ | ✓/✗ | ✓/✗ | ✓/✗ |
| Cerebras | llama3.1-8b, llama3.1-70b, llama3.3-70b | ✗ | ✓ | ✓ | ✓ |
| Groq | meta-llama/llama-4-scout-17b-16e-instruct, llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768, gemma2-9b-it | ✓/✗ | ✓ | ✓ | ✓ |
| Vercel | v0-1.0-md | ✓ | ✓ | ✓ | ✓ |

Additional models available in provider documentation.

### prompts
Three prompt types (text, system, message) with multi-modal content support (text, images, files, tool calls) and provider-specific options at function/message/part levels.

## Prompt Types

The AI SDK supports three prompt structures:

### Text Prompts
Simple string prompts set via the `prompt` property. Ideal for simple generation use cases. Supports template literals for dynamic data injection.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: `I am planning a trip to ${destination} for ${lengthOfStay} days. Please suggest the best tourist activities.`,
});
```

### System Prompts
Initial instructions that guide and constrain model behavior. Set via the `system` property, works with both `prompt` and `messages` properties.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You help planning travel itineraries. Respond with a list of the best stops.',
  prompt: `I am planning a trip to ${destination} for ${lengthOfStay} days.`,
});
```

### Message Prompts
Arrays of user, assistant, and tool messages for chat interfaces and complex multi-modal prompts. Set via the `messages` property. Each message has a `role` and `content` property.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
    { role: 'user', content: 'Where can I buy the best Currywurst in Berlin?' },
  ],
});
```

## Provider Options

Pass provider-specific metadata at three levels:

**Function call level** - for general provider options:
```ts
const { text } = await generateText({
  model: azure('your-deployment-name'),
  providerOptions: {
    openai: { reasoningEffort: 'low' },
  },
});
```

**Message level** - for granular control:
```ts
const messages: ModelMessage[] = [
  {
    role: 'system',
    content: 'Cached system message',
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  },
];
```

**Message part level** - for specific content parts:
```ts
const messages: ModelMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Describe the image in detail.',
        providerOptions: { openai: { imageDetail: 'low' } },
      },
      {
        type: 'image',
        image: 'https://example.com/image.png',
        providerOptions: { openai: { imageDetail: 'low' } },
      },
    ],
  },
];
```

Note: UI hooks like `useChat` return `UIMessage` objects without provider options support. Use `convertToModelMessages` to convert to `ModelMessage` objects first.

## User Messages

### Text Parts
Text content is the most common type. Can be a string directly or within an array of content parts.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Where can I buy the best Currywurst in Berlin?' },
      ],
    },
  ],
});
```

### Image Parts
User messages can include images in multiple formats:
- Base64-encoded: `string` with base-64 content or data URL `data:image/png;base64,...`
- Binary: `ArrayBuffer`, `Uint8Array`, or `Buffer`
- URL: http(s) URL `string` or `URL` object

```ts
// Binary image (Buffer)
const result = await generateText({
  model,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        { type: 'image', image: fs.readFileSync('./data/comic-cat.png') },
      ],
    },
  ],
});

// Base64 encoded image
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        { type: 'image', image: fs.readFileSync('./data/comic-cat.png').toString('base64') },
      ],
    },
  ],
});

// Image URL
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        { type: 'image', image: 'https://example.com/image.png' },
      ],
    },
  ],
});
```

### File Parts
Only supported by Google Generative AI, Google Vertex AI, OpenAI (wav/mp3 audio with gpt-4o-audio-preview, and pdf), and Anthropic. Requires specifying the MIME type.

```ts
// PDF file from Buffer
import { google } from '@ai-sdk/google';
const result = await generateText({
  model: google('gemini-1.5-flash'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the file about?' },
        {
          type: 'file',
          mediaType: 'application/pdf',
          data: fs.readFileSync('./data/example.pdf'),
          filename: 'example.pdf',
        },
      ],
    },
  ],
});

// MP3 audio file from Buffer
import { openai } from '@ai-sdk/openai';
const result = await generateText({
  model: openai('gpt-4o-audio-preview'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the audio saying?' },
        {
          type: 'file',
          mediaType: 'audio/mpeg',
          data: fs.readFileSync('./data/galileo.mp3'),
        },
      ],
    },
  ],
});
```

### Custom Download Function (Experimental)
Implement throttling, retries, authentication, caching via the `experimental_download` property. The default implementation automatically downloads files in parallel when not supported by the model.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  experimental_download: async (
    requestedDownloads: Array<{
      url: URL;
      isUrlSupportedByModel: boolean;
    }>,
  ): PromiseLike<
    Array<{
      data: Uint8Array;
      mediaType: string | undefined;
    } | null>
  > => {
    // download files and return array with similar order
  },
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'file',
          data: new URL('https://api.company.com/private/document.pdf'),
          mediaType: 'application/pdf',
        },
      ],
    },
  ],
});
```

## Assistant Messages

Messages with role `assistant` are typically previous responses from the assistant. Can contain text, reasoning, and tool call parts.

```ts
// Text content
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
  ],
});

// Text content in array
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Hi!' },
    {
      role: 'assistant',
      content: [{ type: 'text', text: 'Hello, how can I help?' }],
    },
  ],
});

// Tool call content
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'How many calories are in this block of cheese?' },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          input: { cheese: 'Roquefort' },
        },
      ],
    },
  ],
});

// File content (model-generated, only few models support)
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'user', content: 'Generate an image of a roquefort cheese!' },
    {
      role: 'assistant',
      content: [
        {
          type: 'file',
          mediaType: 'image/png',
          data: fs.readFileSync('./data/roquefort.jpg'),
        },
      ],
    },
  ],
});
```

## Tool Messages

For models supporting tool calls, assistant messages can contain tool call parts and tool messages can contain tool output parts. A single assistant message can call multiple tools, and a single tool message can contain multiple tool results.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'How many calories are in this block of cheese?' },
        { type: 'image', image: fs.readFileSync('./data/roquefort.jpg') },
      ],
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          input: { cheese: 'Roquefort' },
        },
      ],
    },
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          output: {
            type: 'json',
            value: {
              name: 'Cheese, roquefort',
              calories: 369,
              fat: 31,
              protein: 22,
            },
          },
        },
      ],
    },
  ],
});
```

### Multi-modal Tool Results (Experimental)
Tool results can be multi-part and multi-modal (text and image). Only supported by Anthropic. Use the `experimental_content` property on tool parts.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          output: {
            type: 'json',
            value: {
              name: 'Cheese, roquefort',
              calories: 369,
              fat: 31,
              protein: 22,
            },
          },
        },
        {
          type: 'tool-result',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          output: {
            type: 'content',
            value: [
              { type: 'text', text: 'Here is an image of the nutrition data:' },
              {
                type: 'media',
                data: fs.readFileSync('./data/roquefort-nutrition-data.png').toString('base64'),
                mediaType: 'image/png',
              },
            ],
          },
        },
      ],
    },
  ],
});
```

## System Messages

System messages are sent before user messages to guide assistant behavior. Can be set via `messages` array with role `system` or via the `system` property.

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'system', content: 'You help planning travel itineraries.' },
    {
      role: 'user',
      content: 'I am planning a trip to Berlin for 3 days. Please suggest the best tourist activities.',
    },
  ],
});
```

### tools
Tools are LLM-callable objects with description, inputSchema (Zod/JSON), and optional execute function; use with generateText/streamText; distribute via npm; extensive ecosystem of ready-made packages (web search, Stripe, Composio 250+ tools, AWS Bedrock with Browser/Code Interpreter, MCP servers).

## What is a Tool

A tool is an object that an LLM can invoke to perform discrete tasks and interact with the outside world. Tools enable LLMs to fetch real-time data (like weather), perform calculations, or call external APIs. When an LLM decides to use a tool, it generates a tool call with arguments, which are validated and executed.

A tool consists of three properties:
- `description`: Optional description influencing when the tool is picked
- `inputSchema`: Zod or JSON schema defining required input, consumed by the LLM and used to validate tool calls
- `execute`: Optional async function called with arguments from the tool call

Tools with an `execute` function run automatically when called. Tool results are returned as tool result objects and can be automatically passed back to the LLM using multi-step calls with `streamText` and `generateText`.

## Schemas

Schemas define tool parameters and validate tool calls. The AI SDK supports raw JSON schemas (using `jsonSchema` function) and Zod schemas (directly or using `zodSchema` function).

Install Zod with: `pnpm add zod`, `npm install zod`, `yarn add zod`, or `bun add zod`

Example Zod schema:
```ts
import z from 'zod';

const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  }),
});
```

Schemas can also be used for structured output generation with `generateObject` and `streamObject`.

## Using Tools

Pass tools to `generateText` or `streamText` via the `tools` parameter:

```ts
import { generateText } from 'ai';
import { searchTool } from 'some-tool-package';

const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'When was Vercel Ship AI?',
  tools: {
    webSearch: searchTool,
  },
});
```

## Tool Packages

Tools are JavaScript objects that can be packaged and distributed via npm. Install a tool package and import tools directly:

```bash
pnpm add some-tool-package
```

To publish your own tools, export tool objects from your package:

```ts
// my-tools/index.ts
export const myTool = {
  description: 'A helpful tool',
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    return result;
  },
};
```

Use the AI SDK Tool Package Template for a ready-to-use starting point.

## Ready-to-Use Tool Packages

- **@exalabs/ai-sdk** - Web search tool for real-time information
- **@parallel-web/ai-sdk-tools** - Web search and extract tools via Parallel Web API
- **Stripe agent tools** - Stripe interactions
- **StackOne ToolSet** - Integrations for 100+ enterprise SaaS platforms
- **agentic** - 20+ tools connecting to Exa, E2B, and other external APIs
- **AWS Bedrock AgentCore** - Managed AI agent services with Browser (cloud-based browser runtime) and Code Interpreter (Python, JavaScript, TypeScript sandbox)
- **Composio** - 250+ tools including GitHub, Gmail, Salesforce
- **JigsawStack** - 30+ custom fine-tuned models for specific uses
- **AI Tools Registry** - Shadcn-compatible tool definitions and components registry
- **Toolhouse** - Function-calling for 25+ different actions

## MCP Tools

Pre-built tools available as MCP servers:
- **Smithery** - 6,000+ MCPs including Browserbase and Exa
- **Pipedream** - 3,000+ integrations
- **Apify** - Marketplace with thousands of tools for web scraping, data extraction, and browser automation

## Tool Building Tutorials

- **browserbase** - Building browser tools with headless browser
- **browserless** - Browser automation integration (self-hosted or cloud)
- **AI Tool Maker** - CLI to generate AI SDK tools from OpenAPI specs
- **Interlify** - Converting APIs into tools
- **DeepAgent** - 50+ AI tools and integrations with Tavily, E2B, Airtable, etc.

### streaming
Streaming displays LLM response chunks incrementally instead of waiting for complete generation, dramatically improving UX; implement with `streamText` function and async iteration over `textStream`.

## Why Streaming Matters

Large language models generate long outputs slowly, causing poor user experience with blocking UIs where users wait 5-40+ seconds for complete responses before anything displays. Streaming UIs mitigate this by displaying response parts as they become available, significantly improving perceived performance and user satisfaction in conversational applications.

## Blocking vs Streaming

**Blocking UI**: Waits for entire response generation before displaying anything. Results in long loading spinner waits.

**Streaming UI**: Transmits and displays response parts incrementally as they're generated. Users see content appearing immediately, reducing perceived latency.

## Implementation

The AI SDK simplifies streaming implementation. Stream text generation from OpenAI's gpt-4.1 (or other models like Anthropic Claude) in under 10 lines using the `streamText` function:

```ts
import { streamText } from 'ai';

const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Write a poem about embedding models.',
});

for await (const textPart of textStream) {
  console.log(textPart);
}
```

The `textStream` is an async iterable that yields text chunks as they're generated.

## When to Use Streaming

Streaming is beneficial for long-output LLM responses and conversational applications. However, if a smaller, faster model can achieve desired functionality without streaming, that simpler approach may be preferable for easier development. Regardless of model speed, the SDK makes streaming implementation straightforward.

