## Core Concepts
Generative AI models predict outputs from patterns; LLMs predict text sequences but hallucinate on unknown info; embeddings convert data to semantic vectors.

## Providers & Models
50+ LLM providers (25+ official including OpenAI, Anthropic, Google, Mistral; 25+ community) with standardized interface. Models support image input, object generation, tool usage, and streaming.

## Prompts
Text, system, and message prompts with multi-modal content (text, images, files). Provider options at function/message/part levels.

## Tools
LLM-callable objects with description, inputSchema (Zod/JSON), and execute function. Distribute via npm. Ready-made packages: web search, Stripe, Composio (250+ tools), AWS Bedrock, MCP servers.

## Streaming
`streamText` yields response chunks incrementally via async iterable `textStream` for better UX.