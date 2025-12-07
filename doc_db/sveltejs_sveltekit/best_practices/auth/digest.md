## Sessions vs Tokens

After user authentication via credentials, subsequent requests need to maintain authentication state using either:

- **Session IDs**: Stored in database, can be immediately revoked, but require a database query per request
- **JWT (JSON Web Tokens)**: Not checked against datastore, cannot be immediately revoked, better latency and lower datastore load

## Integration Points

Auth cookies can be checked inside server hooks. When a user matches provided credentials, store user information in `locals` via server hooks.

## Implementation

Use Lucia for session-based auth - it provides example code and projects for SvelteKit. Add it with `npx sv create` (new project) or `npx sv add lucia` (existing project).

Auth systems are tightly coupled to web frameworks since most code involves validating user input, handling errors, and routing users appropriately. Generic JS auth libraries often include multiple web frameworks, so SvelteKit-specific guides like Lucia are preferred over multi-framework solutions.