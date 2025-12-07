## Vector Similarity Search with pgvector

Implement semantic search in PostgreSQL using the pgvector extension to find similar content based on vector embeddings.

### Setup

1. Create the pgvector extension manually via migration:
```bash
npx drizzle-kit generate --custom
```
```sql
CREATE EXTENSION vector;
```

2. Define a table with a vector column and HNSW/IVFFlat index:
```ts
import { index, pgTable, serial, text, vector } from 'drizzle-orm/pg-core';

export const guides = pgTable(
  'guides',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => [
    index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  ]
);
```

### Generate Embeddings

Use OpenAI to convert text to vector embeddings:
```ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\n', ' ');
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input,
  });
  return data[0].embedding;
};
```

### Perform Similarity Search

Query similar items using cosineDistance and a similarity threshold:
```ts
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { generateEmbedding } from './embedding';
import { guides } from './schema';

const db = drizzle(...);

const findSimilarGuides = async (description: string) => {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;
  
  return await db
    .select({ name: guides.title, url: guides.url, similarity })
    .from(guides)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
};

// Usage
const similarGuides = await findSimilarGuides('Guides on using Drizzle ORM with different platforms');
// Returns: [{ name: 'Drizzle with Turso', url: '...', similarity: 0.864 }, ...]
```

**Requirements:** drizzle-orm@0.31.0+, drizzle-kit@0.22.0+, openai package