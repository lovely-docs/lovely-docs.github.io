## Experimental_StdioMCPTransport

Creates a transport for Model Context Protocol (MCP) clients to communicate with MCP servers using standard input and output streams. This transport is only supported in Node.js environments.

### Import
```
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio"
```

### Configuration

The transport accepts a `StdioConfig` object with the following properties:

- `command` (string, required): The command to run the MCP server
- `args` (string[], optional): Arguments to pass to the MCP server
- `env` (Record<string, string>, optional): Environment variables to set for the MCP server
- `stderr` (IOType | Stream | number, optional): The stream to write the MCP server's stderr to
- `cwd` (string, optional): The current working directory for the MCP server

### Notes

This feature is experimental and may change or be removed in the future.