## Sessions vs Tokens

**Session IDs**: Stored in database, can be immediately revoked, but require a database query on each request.

**JWT**: Not checked against datastore, cannot be immediately revoked, but offer improved latency and reduced datastore load.

## Implementation in SvelteKit

Auth cookies can be checked inside server hooks. When a user matches provided credentials, store user information in `locals` via server hooks.

## Framework-Specific Approach

Use framework-specific auth libraries like Lucia rather than generic JS auth libraries, since auth is tightly coupled to the web framework. Most auth code involves validating user input, handling errors, and routing users appropriately. Lucia provides session-based auth examples and can be added via `npx sv add lucia` to existing projects.