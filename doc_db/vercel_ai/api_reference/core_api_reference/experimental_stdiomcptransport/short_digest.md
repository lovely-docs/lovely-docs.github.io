Creates an MCP transport using stdio for Node.js environments.

**Import:** `import { Experimental_StdioMCPTransport } from "ai/mcp-stdio"`

**Configuration (StdioConfig):**
- `command` (string): MCP server command
- `args` (string[], optional): Server arguments
- `env` (Record<string, string>, optional): Environment variables
- `stderr` (IOType | Stream | number, optional): stderr stream destination
- `cwd` (string, optional): Working directory

Experimental feature subject to change.