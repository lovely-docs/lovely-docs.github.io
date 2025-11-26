# lovely-docs

CLI tool and MCP server for managing curated documentation in your projects.

## Installation

```bash
npm install -g lovely-docs
# or
npx lovely-docs
```

## Quick Start

### As a CLI Tool

```bash
# Initialize in your project
npx lovely-docs init

# List available libraries
npx lovely-docs list

# Add a library
npx lovely-docs add sveltejs_svelte

# Remove a library
npx lovely-docs remove sveltejs_svelte

# Interactive mode (default)
npx lovely-docs
```

### As an MCP Server

#### Stdio Mode (for Claude Desktop, Cursor, etc.)

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "lovely-docs": {
      "command": "npx",
      "args": ["-y", "lovely-docs", "mcp"]
    }
  }
}
```

#### HTTP Mode

```bash
# Start HTTP server
npx lovely-docs mcp --transport http --port 3000

# With library filtering
npx lovely-docs mcp --transport http --include-ecosystems svelte
```

## Commands

### `init`

Initialize lovely-docs in your project.

```bash
npx lovely-docs init
npx lovely-docs init -y  # Skip prompts
npx lovely-docs init --repo https://github.com/xl0/lovely-docs --branch master
```

### `list`

List available documentation libraries.

```bash
npx lovely-docs list
```

### `add <library>`

Add a documentation library to your project.

```bash
npx lovely-docs add sveltejs_svelte
```

### `remove <library>`

Remove a documentation library from your project.

```bash
npx lovely-docs remove sveltejs_svelte
```

### `mcp`

Run the MCP server.

```bash
# Stdio mode (default)
npx lovely-docs mcp

# HTTP mode
npx lovely-docs mcp --transport http --port 3000

# With filtering
npx lovely-docs mcp --include-ecosystems svelte webdev
npx lovely-docs mcp --exclude-libs neverthrow
```

## Configuration

Configuration is stored in `.lovely-docs.yaml`:

```yaml
repo: https://github.com/xl0/lovely-docs
branch: master
installed:
  - sveltejs_svelte
  - sveltejs_sveltekit
```

## Documentation Structure

Documentation is installed in `.lovely-docs/` with the following structure:

```
.lovely-docs/
├── sveltejs_svelte.md           # Library digest
├── sveltejs_svelte.md.fulltext  # Library fulltext
└── sveltejs_svelte/
    ├── LLM_MAP.md               # Essence tree (global index)
    ├── runes.md                 # Section digest
    ├── runes.md.fulltext        # Section fulltext
    └── runes/
        ├── $derived.md          # Page digest
        └── $derived.md.fulltext # Page fulltext
```

## MCP Server Features

### Tools

- `listLibraries` - List available documentation libraries
- `listPages` - Get page tree for a library
- `getPage` - Retrieve documentation page content

### Resources

- `lovely-docs://doc-index/{ecosystem}` - List of library names
- `lovely-docs://doc-index-verbose/{ecosystem}` - Libraries with descriptions
- `lovely-docs://index/{name}` - Page index for a library
- `lovely-docs://page/{path}/{level}` - Page content at specific detail level

## Environment Variables

- `BETTERSTACK_SOURCE_TOKEN` - BetterStack logging token (HTTP mode only)
- `BETTERSTACK_ENDPOINT` - BetterStack endpoint (default: `https://in.logs.betterstack.com`)

## License

MIT
