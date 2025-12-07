## Generative AI Concepts

**Generative Models**: Predict and generate outputs (text, images, audio) based on statistical patterns from training data.

**Large Language Models (LLM)**: Subset of generative models that take a sequence of words and predict the most likely next sequence by assigning probabilities. Continue generating until a stopping criterion is met. Trained on massive text collections, so performance varies by domain. Key limitation: hallucination—when asked about unknown information, LLMs may fabricate answers.

**Embedding Models**: Convert complex data (words, images) into dense vector representations (lists of numbers). Unlike generative models, they don't generate new content but provide semantic and syntactic relationship representations usable as input for other models or NLP tasks.

## Providers and Models

The AI SDK provides a unified interface for 50+ LLM providers including OpenAI, Anthropic, Google, Mistral, xAI, Groq, and many others. This abstraction layer allows switching between providers without changing application code.

**Official providers**: xAI Grok, OpenAI, Azure OpenAI, Anthropic, Amazon Bedrock, Google Generative AI, Google Vertex, Mistral, Together.ai, Cohere, Fireworks, DeepInfra, DeepSeek, Cerebras, Groq, Perplexity, ElevenLabs, LMNT, Hume, Rev.ai, Deepgram, Gladia, AssemblyAI, Baseten.

**OpenAI-compatible providers**: LM Studio, Heroku.

**Community providers**: Ollama, FriendliAI, Portkey, Cloudflare Workers AI, OpenRouter, and 20+ others.

**Self-hosted models** accessible via Ollama, LM Studio, Baseten, or any OpenAI-compatible provider.

Model capabilities matrix shows support for: image input, object generation, tool usage, and tool streaming across popular models from each provider.

## Prompts

Three prompt types:

**Text Prompts**: Simple string prompts, ideal for repeated generation with variants:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**System Prompts**: Initial instructions guiding model behavior, works with both `prompt` and `messages`:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You help planning travel itineraries.',
  prompt: 'I am planning a trip to ${destination}...',
});
```

**Message Prompts**: Array of user, assistant, and tool messages for chat interfaces and complex multi-modal prompts:
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

**Message Content Types**:
- **Text parts**: Most common content type
- **Image parts**: Can be base64-encoded, binary (ArrayBuffer/Uint8Array/Buffer), or URL
- **File parts**: Supported by Google Generative AI, Google Vertex AI, OpenAI (wav/mp3 audio, pdf), Anthropic. Requires MIME type.
- **Custom download function** (experimental): Implement throttling, retries, authentication, caching for file downloads

**Assistant Messages**: Messages with role `assistant`, typically previous responses. Can contain text, reasoning, and tool call parts.

**Tool Messages**: For models supporting tool calls. Assistant messages contain tool call parts, tool messages contain tool output parts. Single assistant message can call multiple tools, single tool message can contain multiple results.

**System Messages**: Messages sent before user messages to guide assistant behavior. Alternative to `system` property.

**Provider Options**: Pass provider-specific metadata at three levels:
- Function level: for general provider options
- Message level: for granular control
- Message part level: for specific content parts

## Tools

A tool is an object that an LLM can invoke to perform discrete tasks. Tools are passed to `generateText` and `streamText` via the `tools` parameter.

A tool consists of three properties:
- **`description`**: Optional description influencing when the tool is picked
- **`inputSchema`**: Zod or JSON schema defining required input, consumed by the LLM and used to validate tool calls
- **`execute`**: Optional async function called with arguments from the tool call

When an LLM decides to use a tool, it generates a tool call. Tools with an `execute` function run automatically, and their output is returned as tool result objects. Tool results can be automatically passed back to the LLM using multi-step calls with `streamText` and `generateText`.

**Schemas**: Define tool parameters and validate tool calls. The AI SDK supports raw JSON schemas (using `jsonSchema` function) and Zod schemas (directly or using `zodSchema` function).

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

**Tool Packages**: Tools are JavaScript objects that can be packaged and distributed via npm. Ready-to-use tool packages include: @exalabs/ai-sdk (web search), @parallel-web/ai-sdk-tools (web search and extract), Stripe agent tools, StackOne ToolSet, agentic (20+ tools), AWS Bedrock AgentCore, Composio (250+ tools), JigsawStack (30+ models), AI Tools Registry, Toolhouse (25+ actions).

**MCP server tools**: Smithery (6,000+ MCPs marketplace), Pipedream (3,000+ integrations), Apify (web scraping, data extraction, browser automation).

## Streaming

Large language models generate long outputs slowly (5-40s latency). Blocking UIs force users to wait for the entire response before displaying anything, causing poor UX. Streaming UIs display response parts as they become available, improving perceived performance and user experience.

Stream text generation using `streamText`:
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

The `textStream` can be iterated with `for await` to process each text chunk as it arrives. Streaming greatly enhances UX with larger models, but isn't always necessary for smaller, faster models.