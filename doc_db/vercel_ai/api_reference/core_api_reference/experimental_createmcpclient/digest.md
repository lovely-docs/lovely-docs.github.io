## experimental_createMCPClient()

Creates a lightweight Model Context Protocol (MCP) client for connecting to MCP servers. The client automatically converts between MCP and AI SDK tools, and provides access to server resources, prompts, and elicitation handling.

### Features
- **Tools**: Automatic conversion between MCP tools and AI SDK tools
- **Resources**: List, read, and discover resource templates from MCP servers
- **Prompts**: List available prompts and retrieve prompt messages
- **Elicitation**: Handle server requests for additional input during tool execution

Does not currently support notifications from MCP servers or custom client configuration. This is an experimental API that may change or be removed.

### Configuration

Import from `@ai-sdk/mcp`:
```typescript
import { experimental_createMCPClient } from "@ai-sdk/mcp";
```

The `MCPClientConfig` requires:
- **transport**: Message transport layer configuration
  - `MCPTransport`: Custom transport with `start()`, `send(message)`, `close()`, `onclose()`, `onerror()`, `onmessage()` methods
  - `MCPTransportConfig`: Built-in transports with `type` ('sse' or 'http'), `url`, optional `headers`, optional `authProvider` (OAuth)
- **name** (optional): Client name, defaults to "ai-sdk-mcp-client"
- **onUncaughtError** (optional): Handler for uncaught errors
- **capabilities** (optional): Client capabilities like `{ elicitation: {} }` to enable elicitation request handling

### Methods

**tools(options?)**: Returns available tools from the MCP server
- `options.schemas` (optional): Schema definitions for compile-time type checking; inferred from server if not provided

**listResources(options?)**: Lists all available resources
- `options.params` (optional): Pagination parameters including cursor
- `options.options` (optional): Request options (signal, timeout)

**readResource(args)**: Reads a specific resource by URI
- `args.uri`: Resource URI
- `args.options` (optional): Request options

**listResourceTemplates(options?)**: Lists available resource templates
- `options.options` (optional): Request options

**listPrompts(options?)**: Lists available prompts
- `options.params` (optional): Pagination parameters
- `options.options` (optional): Request options

**getPrompt(args)**: Retrieves a prompt by name
- `args.name`: Prompt name
- `args.arguments` (optional): Arguments to fill into the prompt
- `args.options` (optional): Request options

**onElicitationRequest(schema, handler)**: Registers handler for elicitation requests
- `schema`: Must be `ElicitationRequestSchema`
- `handler`: Function receiving `ElicitationRequest`, returns object with `action` ("accept", "decline", or "cancel") and optional `content`

**close()**: Closes connection and cleans up resources

### Example

```typescript
import {
  experimental_createMCPClient as createMCPClient,
  generateText,
} from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { openai } from '@ai-sdk/openai';

let client;

try {
  client = await createMCPClient({
    transport: new Experimental_StdioMCPTransport({
      command: 'node server.js',
    }),
  });

  const tools = await client.tools();

  const response = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    tools,
    messages: [{ role: 'user', content: 'Query the data' }],
  });

  console.log(response);
} catch (error) {
  console.error('Error:', error);
} finally {
  if (client) {
    await client.close();
  }
}
```

### Error Handling

Throws `MCPClientError` for:
- Client initialization failures
- Protocol version mismatches
- Missing server capabilities
- Connection failures

Tool execution errors are propagated as `CallToolError`. Unknown errors can be handled via the `onUncaughtError` callback.