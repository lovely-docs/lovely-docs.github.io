## Neon Setup

Install `@neondatabase/serverless`, set `DATABASE_URL` env var, connect via neon-http (fast for single queries) or neon-websockets (supports sessions/transactions), define schema, setup postgresql dialect config, apply migrations, seed/query database, run with tsx.

**Key**: HTTP faster for single transactions, WebSockets for interactive sessions.