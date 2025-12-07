## LLMs and Prompts

LLMs predict likely text sequences based on input. Prompt engineering shapes responses using techniques like semantic search and ReActive architecture. Different models have cost/performance trade-offs.

## Techniques

**Instructions:** Make prompts specific. `Create a slogan for an organic coffee shop.` works better than generic versions.

**Examples:** Include input-output examples to demonstrate patterns:
```
Business: Bookstore with cats
Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles"
Business: Coffee shop with live music
Slogans:
```

**Temperature:** Controls randomness (0-1). Lower = deterministic, higher = varied. Use ~0.6 for diverse suggestions.