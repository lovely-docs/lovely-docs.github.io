## What is a Tool

A tool is an object an LLM can invoke to perform tasks and interact with external systems. Tools consist of `description`, `inputSchema` (Zod or JSON schema), and optional `execute` async function. Results are returned as tool result objects and can be automatically passed back to the LLM.

## Schemas

Use Zod (`pnpm add zod`) or JSON schemas to define tool parameters:

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

## Using Tools

Pass tools to `generateText` or `streamText`:

```ts
const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'When was Vercel Ship AI?',
  tools: { webSearch: searchTool },
});
```

## Publishing Tools

Export tool objects from npm packages:

```ts
export const myTool = {
  description: 'A helpful tool',
  inputSchema: z.object({ query: z.string() }),
  execute: async ({ query }) => result,
};
```

## Ready-to-Use Packages

Web search: @exalabs/ai-sdk, @parallel-web/ai-sdk-tools | Integrations: Stripe, StackOne (100+ SaaS), Composio (250+ tools) | APIs: agentic (20+ tools), AWS Bedrock AgentCore (Browser, Code Interpreter) | Utilities: JigsawStack (30+ models), AI Tools Registry, Toolhouse (25+ actions) | MCP: Smithery (6,000+), Pipedream (3,000+), Apify (web scraping/automation)