## experimental_createMCPClient()

Creates an MCP client connecting to MCP servers with automatic tool conversion, resource/prompt access, and elicitation handling.

### Configuration
- **transport**: `MCPTransport` (custom with start/send/close/handlers) or `MCPTransportConfig` (type: 'sse'|'http', url, optional headers/authProvider)
- **name** (optional): Defaults to "ai-sdk-mcp-client"
- **onUncaughtError** (optional): Error handler
- **capabilities** (optional): e.g., `{ elicitation: {} }` to enable elicitation

### Methods
- **tools(options?)**: Get available tools; `options.schemas` for type checking
- **listResources(options?)**: List resources with optional pagination
- **readResource(args)**: Read resource by URI
- **listResourceTemplates(options?)**: List resource templates
- **listPrompts(options?)**: List prompts with optional pagination
- **getPrompt(args)**: Get prompt by name with optional arguments
- **onElicitationRequest(schema, handler)**: Register elicitation handler
- **close()**: Close connection

### Example
```typescript
const client = await createMCPClient({
  transport: new Experimental_StdioMCPTransport({ command: 'node server.js' }),
});
const tools = await client.tools();
const response = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools,
  messages: [{ role: 'user', content: 'Query the data' }],
});
await client.close();
```

### Errors
Throws `MCPClientError` for initialization/protocol/capability/connection failures. Tool errors as `CallToolError`. Use `onUncaughtError` for unknown errors.