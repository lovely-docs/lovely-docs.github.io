# lovely-docs-mcp

MCP server for lovely-docs - provides AI assistants with access to curated documentation for popular libraries and frameworks.

## Installation

```bash
bun install
bun run build
```

## Usage

### As an MCP Server (Stdio)

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
	"mcpServers": {
		"lovely-docs": {
			"command": "npx",
			"args": ["lovely-docs-mcp"]
		}
	}
}
```

### As an HTTP Server

```bash
bun run serve
# or
BETTERSTACK_SOURCE_TOKEN="your-token" bun run serve
```

The server will be available at `http://localhost:3000/mcp`

#### Health/Uptime Endpoint

The HTTP server includes a health check endpoint at `/health`:

```bash
curl http://localhost:3000/health
```

Returns:

```json
{
	"status": "ok",
	"uptime": 123,
	"uptimeMs": 123456,
	"timestamp": "2025-11-23T16:21:48.000Z",
	"mode": "production",
	"transport": "http",
	"version": "0.0.0"
}
```

Use this endpoint for:

-   Uptime monitoring services (BetterStack Uptime, UptimeRobot, etc.)
-   Load balancer health checks
-   Service discovery and orchestration

## Environment Variables

### Documentation Source

-   `LOVELY_DOCS_REPO` - Git repository URL (default: `https://github.com/xl0/lovely-docs`)
-   `LOVELY_DOCS_BRANCH` - Git branch to use (default: `master`)
-   `LOVELY_DOCS_GIT_CACHE_DIR` - Directory for git cache
-   `LOVELY_DOCS_DOC_DIR` - Direct path to doc_db (bypasses git)
-   `LOVELY_DOCS_DEV` - Set to enable development mode (uses local `../doc_db`)

### Logging (HTTP Transport Only)

-   `BETTERSTACK_SOURCE_TOKEN` - BetterStack source token for logging
-   `BETTERSTACK_ENDPOINT` - BetterStack endpoint (default: `https://in.logs.betterstack.com`)

## CLI Options

```bash
lovely-docs-mcp [options]

Options:
  --transport <mode>           Transport mode: 'stdio' or 'http' (default: stdio)
  --http-port <port>          Port for HTTP mode (default: 3000)
  --repo <url>                Git repository URL
  --branch <name>             Git branch name
  --git-cache-dir <path>      Git cache directory
  --git-sync                  Enable/disable git sync (default: true in prod)
  --git-sync-only             Sync git and exit
  --doc-dir <path>            Direct path to doc_db
  --include-libs <libs...>    Include only specific libraries
  --include-ecosystems <eco...> Include only specific ecosystems
  --exclude-libs <libs...>    Exclude specific libraries
  --exclude-ecosystems <eco...> Exclude specific ecosystems
```

## Available Tools

-   `listLibraries` - List available documentation libraries
-   `listPages` - Get page tree for a library
-   `getPage` - Retrieve documentation page content

## Available Resources

-   `lovely-docs://doc-index/{ecosystem}` - List of library names
-   `lovely-docs://doc-index-verbose/{ecosystem}` - Libraries with descriptions
-   `lovely-docs://index/{name}` - Page index for a library
-   `lovely-docs://page/{path}/{level}` - Page content at specific detail level

## Development

```bash
# Development mode with watch
bun run dev

# Build
bun run build

# Sync git repository only
bun run git-sync
```

See [DEV.md](./DEV.md) for detailed developer documentation.

## License

MIT
