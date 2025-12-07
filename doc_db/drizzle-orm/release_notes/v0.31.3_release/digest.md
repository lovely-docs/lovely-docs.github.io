## Bug Fixes

- Fixed RQB behavior for tables with same names in different schemas
- Fixed mismatched type hints when using RDS Data API (#2097)

## Prisma-Drizzle Extension

New extension allows using Drizzle queries within Prisma Client:

```ts
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/pg';
import { User } from './drizzle';

const prisma = new PrismaClient().$extends(drizzle());
const users = await prisma.$drizzle.select().from(User);
```

The extension is initialized via `$extends(drizzle())` and provides `$drizzle` property for executing Drizzle queries. See Prisma integration docs for more details.