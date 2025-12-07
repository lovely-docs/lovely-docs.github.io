

## Pages

### foundational_ai_concepts
Three foundational AI concepts: generative models produce outputs from learned patterns; LLMs predict text sequences but hallucinate on unknown data; embeddings convert data to semantic vectors.

## Generative Artificial Intelligence
Models that predict and generate outputs (text, images, audio) based on statistical patterns from training data. Examples: generating image captions from photos, transcriptions from audio, images from text descriptions.

## Large Language Models (LLM)
Subset of generative models focused on text. Takes a sequence of words as input and predicts the most likely sequence to follow by assigning probabilities to potential next sequences. Continues generating until a stopping criterion is met. Trained on massive text collections, so performance varies by domain (e.g., models trained on GitHub understand source code patterns well). Key limitation: hallucination—when asked about unknown or absent information, LLMs may fabricate answers. Effectiveness depends on how well the required information is represented in the training data.

## Embedding Models
Convert complex data (words, images) into dense vector representations (lists of numbers). Unlike generative models, they don't generate new text/data but provide semantic and syntactic relationship representations usable as input for other models or NLP tasks.

### providers_and_models
Unified interface for 50+ LLM providers (OpenAI, Anthropic, Google, Mistral, xAI, Groq, etc.) with capability matrix showing image input, object generation, tool usage, and streaming support across models.

## Overview

The AI SDK provides a standardized interface for interacting with large language models (LLMs) from different providers through a unified language model specification. This abstraction layer allows switching between providers without changing application code, avoiding vendor lock-in.

## Architecture

The AI SDK uses a provider architecture that abstracts differences between provider APIs, enabling the same code to work across different LLM providers.

## Available Providers

**Official AI SDK Providers:**
- xAI Grok (`@ai-sdk/xai`)
- OpenAI (`@ai-sdk/openai`)
- Azure OpenAI (`@ai-sdk/azure`)
- Anthropic (`@ai-sdk/anthropic`)
- Amazon Bedrock (`@ai-sdk/amazon-bedrock`)
- Google Generative AI (`@ai-sdk/google`)
- Google Vertex (`@ai-sdk/google-vertex`)
- Mistral (`@ai-sdk/mistral`)
- Together.ai (`@ai-sdk/togetherai`)
- Cohere (`@ai-sdk/cohere`)
- Fireworks (`@ai-sdk/fireworks`)
- DeepInfra (`@ai-sdk/deepinfra`)
- DeepSeek (`@ai-sdk/deepseek`)
- Cerebras (`@ai-sdk/cerebras`)
- Groq (`@ai-sdk/groq`)
- Perplexity (`@ai-sdk/perplexity`)
- ElevenLabs (`@ai-sdk/elevenlabs`)
- LMNT (`@ai-sdk/lmnt`)
- Hume (`@ai-sdk/hume`)
- Rev.ai (`@ai-sdk/revai`)
- Deepgram (`@ai-sdk/deepgram`)
- Gladia (`@ai-sdk/gladia`)
- AssemblyAI (`@ai-sdk/assemblyai`)
- Baseten (`@ai-sdk/baseten`)

**OpenAI-Compatible Providers:**
- LM Studio
- Heroku

**Community Providers:**
- Ollama (`ollama-ai-provider`)
- FriendliAI (`@friendliai/ai-provider`)
- Portkey (`@portkey-ai/vercel-provider`)
- Cloudflare Workers AI (`workers-ai-provider`)
- OpenRouter (`@openrouter/ai-sdk-provider`)
- Aihubmix (`@aihubmix/ai-sdk-provider`)
- Requesty (`@requesty/ai-sdk`)
- Crosshatch (`@crosshatch/ai-provider`)
- Mixedbread (`mixedbread-ai-provider`)
- Voyage AI (`voyage-ai-provider`)
- Mem0 (`@mem0/vercel-ai-provider`)
- Letta (`@letta-ai/vercel-ai-sdk-provider`)
- Supermemory (`@supermemory/tools`)
- Spark (`spark-ai-provider`)
- AnthropicVertex (`anthropic-vertex-ai`)
- LangDB (`@langdb/vercel-provider`)
- Dify (`dify-ai-provider`)
- Sarvam (`sarvam-ai-provider`)
- Claude Code (`ai-sdk-provider-claude-code`)
- Built-in AI (`built-in-ai`)
- Gemini CLI (`ai-sdk-provider-gemini-cli`)
- A2A (`a2a-ai-provider`)
- SAP-AI (`@mymediset/sap-ai-provider`)
- AI/ML API (`@ai-ml.api/aimlapi-vercel-ai`)
- MCP Sampling (`@mcpc-tech/mcp-sampling-ai-provider`)
- ACP (`@mcpc-tech/acp-ai-provider`)

## Self-Hosted Models

Self-hosted models can be accessed via:
- Ollama
- LM Studio
- Baseten
- Built-in AI
- Any provider supporting OpenAI specification via OpenAI Compatible Provider

## Model Capabilities

Popular models and their capabilities:

| Provider | Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----------|-------|-------------|-------------------|------------|----------------|
| xAI Grok | grok-4, grok-3, grok-3-fast, grok-3-mini, grok-3-mini-fast, grok-2-1212, grok-beta | ✗ (except grok-2-vision-1212, grok-vision-beta) | ✓ | ✓ | ✓ |
| xAI Grok | grok-2-vision-1212, grok-vision-beta | ✓ | ✓ (except grok-vision-beta) | ✓ (except grok-vision-beta) | ✓ (except grok-vision-beta) |
| Vercel | v0-1.0-md | ✓ | ✓ | ✓ | ✓ |
| OpenAI | gpt-5, gpt-5-mini, gpt-5-nano, gpt-5.1-chat-latest, gpt-5.1-codex-mini, gpt-5.1-codex, gpt-5.1, gpt-5-codex, gpt-5-chat-latest | ✓ | ✓ | ✓ | ✓ |
| Anthropic | claude-opus-4-5, claude-opus-4-1, claude-opus-4-0, claude-sonnet-4-0, claude-3-7-sonnet-latest, claude-3-5-haiku-latest | ✓ | ✓ | ✓ | ✓ |
| Mistral | pixtral-large-latest, pixtral-12b-2409 | ✓ | ✓ | ✓ | ✓ |
| Mistral | mistral-large-latest, mistral-medium-latest, mistral-medium-2505, mistral-small-latest | ✗ | ✓ | ✓ | ✓ |
| Google Generative AI | gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro | ✓ | ✓ | ✓ | ✓ |
| Google Vertex | gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro | ✓ | ✓ | ✓ | ✓ |
| DeepSeek | deepseek-chat | ✗ | ✓ | ✓ | ✓ |
| DeepSeek | deepseek-reasoner | ✗ | ✗ | ✗ | ✗ |
| Cerebras | llama3.1-8b, llama3.1-70b, llama3.3-70b | ✗ | ✓ | ✓ | ✓ |
| Groq | meta-llama/llama-4-scout-17b-16e-instruct | ✓ | ✓ | ✓ | ✓ |
| Groq | llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768, gemma2-9b-it | ✗ | ✓ | ✓ | ✓ |

The language model specification is open-source and can be used to create custom providers.

### prompts
Text/system/message prompts; message content types (text, images, files, tool calls); provider options at function/message/part levels; user/assistant/tool/system message structures.

## Prompts

Prompts are instructions given to LLMs. The AI SDK supports three prompt types:

### Text Prompts
Simple string prompts, ideal for repeated generation with variants. Set via `prompt` property:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

// With template literals for dynamic data:
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: `I am planning a trip to ${destination} for ${lengthOfStay} days. Please suggest the best tourist activities for me to do.`,
});
```

### System Prompts
Initial instructions that guide model behavior. Set via `system` property, works with both `prompt` and `messages`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: `You help planning travel itineraries. Respond to the users' request with a list of the best stops to make in their destination.`,
  prompt: `I am planning a trip to ${destination} for ${lengthOfStay} days. Please suggest the best tourist activities for me to do.`,
});
```

### Message Prompts
Array of user, assistant, and tool messages for chat interfaces and complex multi-modal prompts. Set via `messages` property. Each message has `role` and `content`:

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

Content can be text string or array of parts (text, images, files, tool calls).

### Provider Options
Pass provider-specific metadata at three levels:

**Function level** - for general provider options:
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
        image: 'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true',
        providerOptions: { openai: { imageDetail: 'low' } },
      },
    ],
  },
];
```

### User Messages

**Text parts** - most common content type:
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

**Image parts** - can be base64-encoded, binary (ArrayBuffer/Uint8Array/Buffer), or URL:
```ts
// Binary (Buffer):
{ type: 'image', image: fs.readFileSync('./data/comic-cat.png') }

// Base64 string:
{ type: 'image', image: fs.readFileSync('./data/comic-cat.png').toString('base64') }

// URL string:
{ type: 'image', image: 'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true' }

// URL object:
{ type: 'image', image: new URL('https://example.com/image.png') }
```

**File parts** - supported by Google Generative AI, Google Vertex AI, OpenAI (wav/mp3 audio, pdf), Anthropic. Requires MIME type:
```ts
// PDF from Buffer:
{
  type: 'file',
  mediaType: 'application/pdf',
  data: fs.readFileSync('./data/example.pdf'),
  filename: 'example.pdf', // optional
}

// MP3 audio from Buffer:
{
  type: 'file',
  mediaType: 'audio/mpeg',
  data: fs.readFileSync('./data/galileo.mp3'),
}
```

**Custom download function** (experimental) - implement throttling, retries, authentication, caching:
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

### Assistant Messages
Messages with role `assistant`, typically previous responses. Can contain text, reasoning, and tool call parts:

```ts
// Text content:
{ role: 'assistant', content: 'Hello, how can I help?' }

// Text in array:
{ role: 'assistant', content: [{ type: 'text', text: 'Hello, how can I help?' }] }

// Tool call content:
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
}

// File content (model-generated, limited support):
{
  role: 'assistant',
  content: [
    {
      type: 'file',
      mediaType: 'image/png',
      data: fs.readFileSync('./data/roquefort.jpg'),
    },
  ],
}
```

### Tool Messages
For models supporting tool calls. Assistant messages contain tool call parts, tool messages contain tool output parts. Single assistant message can call multiple tools, single tool message can contain multiple results:

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

**Multi-modal tool results** (experimental, Anthropic only) - use `experimental_content` for multi-part results:
```ts
{
  role: 'tool',
  content: [
    {
      type: 'tool-result',
      toolCallId: '12345',
      toolName: 'get-nutrition-data',
      output: {
        type: 'json',
        value: { name: 'Cheese, roquefort', calories: 369, fat: 31, protein: 22 },
      },
    },
    {
      type: 'tool-result',
      toolCallId: '12345',
      toolName: 'get-nutrition-data',
      output: {
        type: 'content',
        value: [
          { type: 'text', text: 'Here is an image of the nutrition data for the cheese:' },
          {
            type: 'media',
            data: fs.readFileSync('./data/roquefort-nutrition-data.png').toString('base64'),
            mediaType: 'image/png',
          },
        ],
      },
    },
  ],
}
```

### System Messages
Messages sent before user messages to guide assistant behavior. Alternative to `system` property:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: [
    { role: 'system', content: 'You help planning travel itineraries.' },
    {
      role: 'user',
      content: 'I am planning a trip to Berlin for 3 days. Please suggest the best tourist activities for me to do.',
    },
  ],
});
```

### tools
Tools are LLM-callable objects with description, inputSchema (Zod/JSON), and optional execute function; pass to generateText/streamText; extensive ecosystem of ready-made packages and MCP servers available.

## What is a tool?

A tool is an object that an LLM can invoke to perform discrete tasks and interact with the outside world. Tools are passed to `generateText` and `streamText` via the `tools` parameter.

A tool consists of three properties:
- **`description`**: Optional description influencing when the tool is picked
- **`inputSchema`**: Zod or JSON schema defining required input, consumed by the LLM and used to validate tool calls
- **`execute`**: Optional async function called with arguments from the tool call

When an LLM decides to use a tool, it generates a tool call. Tools with an `execute` function run automatically, and their output is returned as tool result objects. Tool results can be automatically passed back to the LLM using multi-step calls with `streamText` and `generateText`.

## Schemas

Schemas define tool parameters and validate tool calls. The AI SDK supports raw JSON schemas (using `jsonSchema` function) and Zod schemas (directly or using `zodSchema` function).

Install Zod:
```bash
pnpm add zod
npm install zod
yarn add zod
bun add zod
```

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

Schemas can also be used with `generateObject` and `streamObject` for structured output generation.

## Tool Packages

Tools are JavaScript objects that can be packaged and distributed via npm.

### Using Ready-Made Tool Packages

Install and import tools:
```bash
pnpm add some-tool-package
```

```ts
import { generateText, stepCountIs } from 'ai';
import { searchTool } from 'some-tool-package';

const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'When was Vercel Ship AI?',
  tools: {
    webSearch: searchTool,
  },
  stopWhen: stepCountIs(10),
});
```

### Publishing Your Own Tools

Export tool objects from your package:
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

## Toolsets

Ready-to-use tool packages:
- **@exalabs/ai-sdk** - Web search tool
- **@parallel-web/ai-sdk-tools** - Web search and extract tools
- **Stripe agent tools** - Stripe interactions
- **StackOne ToolSet** - Enterprise SaaS integrations
- **agentic** - 20+ tools connecting to Exa, E2B, etc.
- **AWS Bedrock AgentCore** - Browser runtime and code interpreter
- **Composio** - 250+ tools (GitHub, Gmail, Salesforce, etc.)
- **JigsawStack** - 30+ custom fine-tuned models
- **AI Tools Registry** - Shadcn-compatible tool definitions
- **Toolhouse** - 25+ actions in 3 lines of code

MCP server tools:
- **Smithery** - 6,000+ MCPs marketplace
- **Pipedream** - 3,000+ integrations
- **Apify** - Web scraping, data extraction, browser automation

Tool building tutorials:
- **browserbase** - Headless browser tools
- **browserless** - Browser automation integration
- **AI Tool Maker** - CLI to generate tools from OpenAPI specs
- **Interlify** - Convert APIs to tools
- **DeepAgent** - 50+ AI tools and integrations

### streaming
Streaming displays LLM response parts incrementally instead of waiting for full generation; use `streamText` with `for await` iteration to stream text chunks.

## Why Streaming Matters

Large language models generate long outputs slowly (5-40s latency). Blocking UIs force users to wait for the entire response before displaying anything, causing poor UX. Streaming UIs display response parts as they become available, improving perceived performance and user experience.

## Blocking vs Streaming

**Blocking UI**: Waits for full response generation before displaying anything.

**Streaming UI**: Transmits and displays response parts incrementally as they're generated.

Real-world example: Generating the first 200 characters of a Harry Potter book shows streaming displays results much faster than blocking because it doesn't wait for completion.

## When to Use Streaming

Streaming greatly enhances UX with larger models, but isn't always necessary. Smaller, faster models may not need streaming and can lead to simpler development.

## Implementation

The AI SDK makes streaming simple. Stream text generation from OpenAI's gpt-4.1 in under 10 lines using `streamText`:

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

The `streamText` function returns a `textStream` that can be iterated with `for await` to process each text chunk as it arrives.

