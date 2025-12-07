## AI SDK Core

Standardized interface for working with LLMs. Four main functions:
- `generateText` / `streamText`: Text generation for non-interactive and interactive use cases
- `generateObject` / `streamObject`: Structured data generation with Zod schemas

All functions use consistent prompt and settings configuration across different models.