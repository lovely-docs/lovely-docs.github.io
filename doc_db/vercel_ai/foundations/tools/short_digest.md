## What is a tool?

A tool is an object the LLM can invoke, consisting of `description`, `inputSchema` (Zod or JSON), and optional `execute` async function. Tools are passed to `generateText`/`streamText` via the `tools` parameter. When the LLM calls a tool, it generates a tool call; tools with `execute` run automatically and return results that can be fed back to the LLM.

## Schemas

Use Zod or JSON schemas to define tool parameters. Install Zod with `pnpm add zod`. Example:
```ts
import z from 'zod';
const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
    steps: z.array(z.string()),
  }),
});
```

## Tool Packages

Import ready-made tools from npm packages and pass to `generateText`/`streamText`:
```ts
import { generateText } from 'ai';
import { searchTool } from 'some-tool-package';
const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'When was Vercel Ship AI?',
  tools: { webSearch: searchTool },
});
```

Publish your own tools by exporting tool objects with `description`, `inputSchema`, and `execute`.

## Toolsets

Ready-made packages: @exalabs/ai-sdk (web search), @parallel-web/ai-sdk-tools, Stripe agent tools, StackOne, agentic (20+ tools), AWS Bedrock AgentCore, Composio (250+ tools), JigsawStack, AI Tools Registry, Toolhouse.

MCP servers: Smithery (6,000+ MCPs), Pipedream (3,000+ integrations), Apify (web scraping/automation).

Tutorials: browserbase, browserless, AI Tool Maker (OpenAPI to tools), Interlify, DeepAgent (50+ tools).