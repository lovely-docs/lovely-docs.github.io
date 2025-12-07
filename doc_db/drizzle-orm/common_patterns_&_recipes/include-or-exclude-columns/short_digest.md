## Column Selection Methods

**Query Builder:**
- All columns: `.select().from(table)`
- Specific: `.select({ title: posts.title }).from(posts)`
- With extras: `.select({ ...getTableColumns(posts), computed: sql\`...\` }).from(posts)`
- Exclude: `const { col, ...rest } = getTableColumns(table); .select({ ...rest })`

**Relational Queries:**
- All: `db.query.posts.findMany()`
- Include: `{ columns: { title: true } }`
- Exclude: `{ columns: { content: false } }`
- With relations: `{ columns: {...}, with: { comments: { columns: {...} }, user: true } }`

**Joins:** Use getTableColumns() with destructuring to include/exclude from joined tables