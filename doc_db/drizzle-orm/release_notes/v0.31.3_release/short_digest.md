## Fixes
- RQB behavior for same-named tables in different schemas
- RDS Data API type hints

## Prisma Extension
```ts
const prisma = new PrismaClient().$extends(drizzle());
const users = await prisma.$drizzle.select().from(User);
```