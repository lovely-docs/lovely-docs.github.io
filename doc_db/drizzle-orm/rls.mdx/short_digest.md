## Row-Level Security (RLS)

Enable RLS on tables with `.enableRLS()`. Define roles with `pgRole()` and mark existing ones with `.existing()`. Create policies with `pgPolicy()` specifying `as` (permissive/restrictive), `to` (role), `for` (command type), `using`, and `withCheck` SQL clauses.

Enable role management in `drizzle.config.ts` with `entities.roles: true`, optionally with `exclude`, `include`, or `provider` options.

Apply RLS to views with `securityInvoker: true` in WITH options.

**Neon:** Use `crudPolicy()` from `drizzle-orm/neon` with predefined `authenticatedRole`, `anonymousRole`, and `authUid()` function.

**Supabase:** Use predefined roles (`anonRole`, `authenticatedRole`, `serviceRole`, etc.) and tables (`authUsers`, `realtimeMessages`) from `drizzle-orm/supabase`. Link policies to existing tables with `.link()`. Use `createDrizzle()` wrapper to handle RLS transactions with JWT token context.