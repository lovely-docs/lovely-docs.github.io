## Initializing MCP Client

Three transport options:
- **HTTP (recommended)**: `{ type: 'http', url: '...', headers: {...}, authProvider: ... }`
- **SSE**: `{ type: 'sse', url: '...', headers: {...}, authProvider: ... }`
- **Stdio (local only)**: `new StdioClientTransport({ command: 'node', args: [...] })`

Close client when done: use `onFinish` for streaming, try/finally for non-streaming.

## Using MCP Tools

**Schema Discovery** - Auto-list all tools:
```typescript
const tools = await mcpClient.tools();
```

**Schema Definition** - Type-safe explicit tools:
```typescript
const tools = await mcpClient.tools({
  schemas: {
    'get-data': { inputSchema: z.object({ query: z.string() }) },
    'tool-with-no-args': { inputSchema: z.object({}) },
  },
});
```

## Using MCP Resources & Prompts

```typescript
const resources = await mcpClient.listResources();
const resourceData = await mcpClient.readResource({ uri: '...' });
const templates = await mcpClient.listResourceTemplates();

const prompts = await mcpClient.listPrompts();
const prompt = await mcpClient.getPrompt({ name: 'code_review', arguments: {...} });
```

## Handling Elicitation

Enable capability: `capabilities: { elicitation: {} }`

Register handler:
```typescript
mcpClient.onElicitationRequest(ElicitationRequestSchema, async request => {
  const userInput = await getInputFromUser(request.params.message, request.params.requestedSchema);
  return { action: 'accept', content: userInput }; // or 'decline'/'cancel'
});
```