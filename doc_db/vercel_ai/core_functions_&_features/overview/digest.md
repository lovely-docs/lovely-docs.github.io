AI SDK Core simplifies working with Large Language Models by providing a standardized interface for integrating them into applications.

**Core Functions:**

- `generateText`: Generates text and tool calls for non-interactive use cases like automation tasks (drafting emails, summarizing web pages) and agents that use tools.
- `streamText`: Streams text and tool calls for interactive use cases like chatbots and content streaming.
- `generateObject`: Generates a typed, structured object matching a Zod schema for information extraction, synthetic data generation, or classification tasks.
- `streamObject`: Streams a structured object matching a Zod schema for streaming generated UIs.

All functions use a standardized approach to setting up prompts and settings, making it easier to work with different models without worrying about technical details.