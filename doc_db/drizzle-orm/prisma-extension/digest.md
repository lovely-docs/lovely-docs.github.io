## Drizzle Extension for Prisma

Allows using Drizzle alongside Prisma in existing projects by extending the Prisma client with Drizzle API, reusing the same DB connection.

### Setup

1. Install dependencies:
```bash
npm install drizzle-orm
npm install -D drizzle-prisma-generator
```

2. Add generator to `schema.prisma`:
```prisma
generator drizzle {
  provider = "drizzle-prisma-generator"
  output   = "./drizzle"
}
```

3. Generate schema:
```bash
prisma generate
```

4. Extend Prisma client (PostgreSQL example; also available for MySQL and SQLite):
```ts
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/pg';

const prisma = new PrismaClient().$extends(drizzle());
```

5. Use Drizzle queries via `prisma.$drizzle`:
```ts
import { User } from './drizzle';

await prisma.$drizzle.insert().into(User).values({ email: 'sorenbs@drizzle.team', name: 'Søren' });
const users = await prisma.$drizzle.select().from(User);
```

### Limitations

- Relational queries not supported (Prisma driver limitation with array format results)
- SQLite: `.values()` not supported
- Prepared statements: `.prepare()` builds SQL on Drizzle side only, no Prisma API for prepared queries