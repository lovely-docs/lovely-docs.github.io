## Getting Started with Neon

Drizzle ORM provides native support for Neon (serverless Postgres platform) through two drivers:

- **neon-http**: HTTP-based driver, faster for single non-interactive transactions
- **neon-websockets**: WebSocket-based driver with session and interactive transaction support

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- Neon account and serverless Postgres platform access

### Setup Steps

1. **Install the Neon serverless package**
   ```bash
   npm install @neondatabase/serverless
   ```

2. **Configure environment variables**
   - Set `DATABASE_URL` with your Neon connection string

3. **Connect Drizzle to Neon**
   - Use the neon-http or neon-websockets driver to establish connection

4. **Create tables**
   - Define your schema using Drizzle ORM table definitions

5. **Setup Drizzle config file**
   - Configure with `postgresql` dialect and `DATABASE_URL` environment variable

6. **Apply migrations**
   - Run migrations to apply schema changes to the database

7. **Seed and query the database**
   - Use neon-http driver for database operations

8. **Execute your code**
   - Run the index.ts file with tsx

### Key Advantages
- Access Neon database from serverless environments over HTTP/WebSockets instead of TCP
- HTTP queries are faster for single, non-interactive transactions
- WebSocket driver provides full session and interactive transaction support
- Drop-in replacement for pg driver available via neon-serverless