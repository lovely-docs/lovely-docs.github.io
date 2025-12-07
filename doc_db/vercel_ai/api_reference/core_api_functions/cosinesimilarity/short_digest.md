Calculates cosine similarity between two vectors, returning a value between -1 and 1 (1 = very similar, -1 = different).

```ts
import { cosineSimilarity, embedMany } from 'ai';
const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});
console.log(`cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`);
```