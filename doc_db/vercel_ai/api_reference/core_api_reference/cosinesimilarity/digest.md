## cosineSimilarity()

Calculates the cosine similarity between two vectors, a standard metric for comparing embedding similarity.

**Purpose**: Determine how similar two vectors are by computing their cosine similarity. Returns a value between -1 and 1, where values close to 1 indicate very similar vectors and values close to -1 indicate dissimilar vectors.

**Parameters**:
- `vector1` (number[]): The first vector to compare
- `vector2` (number[]): The second vector to compare

**Returns**: A number between -1 and 1 representing the cosine similarity.

**Example**:
```ts
import { openai } from '@ai-sdk/openai';
import { cosineSimilarity, embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});

console.log(
  `cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`,
);
```

**Import**: `import { cosineSimilarity } from "ai"`