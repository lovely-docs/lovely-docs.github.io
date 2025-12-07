## Model Context Protocol (MCP) Tools

Connect to MCP servers to access tools, resources, and prompts.

**Initialize client** with HTTP (recommended), SSE, or stdio transport:
```typescript
import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';

const mcpClient = await createMCPClient({
  transport: {
    type: 'http', // or 'sse'
    url: 'https://your-server.com/mcp',
    headers: { Authorization: 'Bearer my-api-key' },
  },
});
```

**Close client** when done (use `onFinish` for streaming, try/finally for long-running):
```typescript
await mcpClient.close();
```

**Use tools** via schema discovery or explicit definitions:
```typescript
const tools = await mcpClient.tools(); // auto-discover
// or
const tools = await mcpClient.tools({
  schemas: { 'tool-name': { inputSchema: z.object({...}) } }
});
```

**Access resources** (application-driven context):
```typescript
const resources = await mcpClient.listResources();
const data = await mcpClient.readResource({ uri: 'file:///path' });
const templates = await mcpClient.listResourceTemplates();
```

**Use prompts** (user-controlled templates):
```typescript
const prompts = await mcpClient.listPrompts();
const prompt = await mcpClient.getPrompt({ name: 'code_review', arguments: {...} });
```

**Handle elicitation** (server requests for client input):
```typescript
const mcpClient = await createMCPClient({
  transport: {...},
  capabilities: { elicitation: {} },
});

mcpClient.onElicitationRequest(ElicitationRequestSchema, async request => {
  const userInput = await getInputFromUser(request.params.message, request.params.requestedSchema);
  return { action: 'accept', content: userInput }; // or 'decline'/'cancel'
});
```