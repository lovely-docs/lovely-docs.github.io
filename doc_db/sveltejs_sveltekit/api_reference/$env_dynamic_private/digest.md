Module for accessing runtime environment variables that are private (server-side only).

**Purpose**: Provides access to environment variables defined by your platform at runtime. Only includes variables that don't start with `config.kit.env.publicPrefix` and do start with `config.kit.env.privatePrefix` (if configured).

**Key characteristics**:
- Server-side only - cannot be imported into client-side code
- Equivalent to `process.env` when using adapter-node or vite preview
- In dev mode, automatically includes variables from `.env`
- In prod mode, behavior depends on your adapter

**Usage**:
```ts
import { env } from '$env/dynamic/private';
console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
```