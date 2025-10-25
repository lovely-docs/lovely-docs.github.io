# Lovely Docs MCP Server

A Model Context Protocol (MCP) server that exposes processed documentation as MCP resources.

## Features

- Automatically discovers all libraries in the `processed_documents` directory
- Exposes each document as an MCP resource with URI scheme `lovely-docs://`
- Provides library overviews with statistics
- Serves document summaries, short summaries, and original content

## Installation

```bash
bun install
```

## Usage

### Running the server

The server accepts the path to the `processed_documents` directory as the first argument:

```bash
bun start /path/to/processed_documents
```

Or use the default relative path:

```bash
bun start ../processed_documents
```

You can also set the path via environment variable:

```bash
LOVELY_DOCS_PATH=/path/to/processed_documents bun start
```

### Development mode (with auto-reload)

```bash
bun run dev ../processed_documents
```

### Using with Claude Desktop

Add this to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "lovely-docs": {
      "command": "bun",
      "args": [
        "run",
        "/absolute/path/to/lovely-docs/mcp/index.ts",
        "/absolute/path/to/lovely-docs/processed_documents"
      ]
    }
  }
}
```

## Resource URIs

Documents are exposed with the following URI scheme:

- Library overview: `lovely-docs://<library-key>`
- Document: `lovely-docs://<library-key>/<document-path>`

Example:
- `lovely-docs://sveltejs-svelte` - Svelte library overview
- `lovely-docs://sveltejs-svelte/svelte-reactivity-system/svelte-runes-reference/runes-overview` - Specific document

## Architecture

The server communicates via stdio and implements the MCP protocol to expose documentation tools to AI assistants.

## Development

Built with:
- [Bun](https://bun.sh) - Fast JavaScript runtime
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) - MCP SDK
- TypeScript
