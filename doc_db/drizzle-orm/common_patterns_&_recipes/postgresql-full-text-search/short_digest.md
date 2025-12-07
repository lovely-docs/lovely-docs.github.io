## PostgreSQL Full-Text Search

Use `to_tsvector()` to convert text to searchable tokens and `to_tsquery()` to create search queries. The `@@` operator matches them.

**Basic search:**
```ts
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', 'trip')`);
```

**Query types:** `to_tsquery()` (exact), `plainto_tsquery()` (AND keywords), `phraseto_tsquery()` (phrase), `websearch_to_tsquery()` (web syntax with `or`/`and`), or `|` operator (OR).

**Multi-column search** with `setweight()` to assign weights (A/B/C/D):
```ts
sql`(setweight(to_tsvector('english', ${posts.title}), 'A') ||
    setweight(to_tsvector('english', ${posts.description}), 'B'))
    @@ to_tsquery('english', ${search})`
```

**Ranking:** Use `ts_rank()` (frequency-based) or `ts_rank_cd()` (proximity-based) with `orderBy()`.

**Indexing:** Create GIN index on `to_tsvector()` expression for performance. Drizzle doesn't support `tsvector` type natively.
