## Overview
Connect to Model Context Protocol (MCP) servers to access their tools, resources, and prompts through a standardized interface. The feature is experimental.

## Initializing MCP Client

Three transport options available:

**HTTP Transport (Recommended for production)**
```typescript
const mcpClient = await createMCPClient({
  transport: {
    type: 'http',
    url: 'https://your-server.com/mcp',
    headers: { Authorization: 'Bearer my-api-key' },
    authProvider: myOAuthClientProvider, // optional OAuth
  },
});
```

**SSE Transport (Alternative HTTP-based)**
```typescript
const mcpClient = await createMCPClient({
  transport: {
    type: 'sse',
    url: 'https://my-server.com/sse',
    headers: { Authorization: 'Bearer my-api-key' },
    authProvider: myOAuthClientProvider,
  },
});
```

**Stdio Transport (Local development only)**
```typescript
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const mcpClient = await createMCPClient({
  transport: new StdioClientTransport({
    command: 'node',
    args: ['src/stdio/dist/server.js'],
  }),
});
```

You can also use `StreamableHTTPClientTransport` from MCP's official SDK or implement custom transport via `MCPTransport` interface.

**Client Lifecycle**: Close the client when done. For streaming responses, use `onFinish` callback. For non-streaming, use try/finally.

```typescript
const result = await streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools,
  prompt: 'What is the weather in Brooklyn, New York?',
  onFinish: async () => {
    await mcpClient.close();
  },
});
```

## Using MCP Tools

Two approaches for tool schemas:

**Schema Discovery** - Automatically list all server tools with inferred types:
```typescript
const tools = await mcpClient.tools();
```
Simpler but no TypeScript type safety.

**Schema Definition** - Explicitly define tools with Zod schemas for type safety:
```typescript
const tools = await mcpClient.tools({
  schemas: {
    'get-data': {
      inputSchema: z.object({
        query: z.string().describe('The data query'),
        format: z.enum(['json', 'text']).optional(),
      }),
    },
    'tool-with-no-args': {
      inputSchema: z.object({}),
    },
  },
});
```

## Using MCP Resources

Resources are application-driven data sources that provide context. Unlike tools (model-controlled), your application decides when to fetch resources.

**List resources:**
```typescript
const resources = await mcpClient.listResources();
```

**Read resource contents:**
```typescript
const resourceData = await mcpClient.readResource({
  uri: 'file:///example/document.txt',
});
```

**List resource templates** (dynamic URI patterns):
```typescript
const templates = await mcpClient.listResourceTemplates();
```

## Using MCP Prompts

Prompts are user-controlled templates servers expose.

**List prompts:**
```typescript
const prompts = await mcpClient.listPrompts();
```

**Get a prompt with optional arguments:**
```typescript
const prompt = await mcpClient.getPrompt({
  name: 'code_review',
  arguments: { code: 'function add(a, b) { return a + b; }' },
});
```

## Handling Elicitation Requests

Elicitation allows MCP servers to request additional information from the client during tool execution (e.g., user confirmation, form input).

**Enable elicitation capability:**
```typescript
const mcpClient = await experimental_createMCPClient({
  transport: {
    type: 'sse',
    url: 'https://your-server.com/sse',
  },
  capabilities: {
    elicitation: {},
  },
});
```

**Register elicitation handler:**
```typescript
mcpClient.onElicitationRequest(ElicitationRequestSchema, async request => {
  // request.params.message: description of needed input
  // request.params.requestedSchema: JSON schema for expected input

  const userInput = await getInputFromUser(
    request.params.message,
    request.params.requestedSchema,
  );

  return {
    action: 'accept', // or 'decline' or 'cancel'
    content: userInput, // required only for 'accept'
  };
});
```

Response actions: `'accept'` (with content), `'decline'`, or `'cancel'`.