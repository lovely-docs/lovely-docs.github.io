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