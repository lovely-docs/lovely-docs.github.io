Use pgvector extension to implement semantic search with vector embeddings. Create a table with vector column and HNSW index, generate embeddings via OpenAI, then query similar items using `cosineDistance` with a similarity threshold:

```ts
const guides = pgTable('guides', {
  id: serial('id').primaryKey(),
  embedding: vector('embedding', { dimensions: 1536 }),
  // ...
}, (table) => [
  index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
]);

const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;
const results = await db.select({ name: guides.title, similarity })
  .from(guides)
  .where(gt(similarity, 0.5))
  .orderBy((t) => desc(t.similarity));
```