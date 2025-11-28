## Foundations
Generative AI, 50+ provider integrations, multi-modal prompts, tools, streaming.

## Getting Started
SDK architecture (Core, UI, RSC). Quick start: API route with `streamText()`, UI component with `useChat()`. Tools with Zod schemas. Framework-specific patterns.

## Agents
`ToolLoopAgent` automates LLM task execution with tool loops. Configuration: stopWhen, tool choice, structured output, instructions. Usage: `generate()`, `stream()`, `createAgentUIStreamResponse()`.

## Core Functions
`generateText()`, `streamText()`, `generateObject()`, `streamObject()`. Tool calling with multi-step support. Embeddings, reranking, multimodal (image/speech/transcription). Middleware, provider management, error handling, testing, telemetry.

## UI Toolkit
`useChat`, `useCompletion`, `useObject` hooks. Message management with `parts`. Tool integration. Request customization. Chat persistence. Generative UI. Transport and stream protocols.

## React Server Components
`streamUI`, `useUIState`/`useAIState`, `useActions`, `createAI`. Streamable values. State management. Patterns: streaming components, multistep interfaces, client interactions. Migration to AI SDK UI.

## Advanced Patterns
Prompt engineering, stream management (cancellation, back-pressure), caching, UI rendering/routing, multistep interfaces, sequential generations, rate limiting, deployment.

## API Reference
Core functions, agents/tools, MCP, schema, provider registry, utilities, UI hooks, RSC, errors.

## Migration Guides
4.x→5.0 (message structure, maxTokens→maxOutputTokens, maxSteps→stopWhen, UI changes). 3.4→4.0 (baseUrl, await removal). 4.1→4.2 (stabilize APIs). 5.0→6.0 Beta (agents, tool approval). Process: backup, upgrade, codemods, verify.

## Troubleshooting
Streaming issues, useChat configuration, tool calling, Server Actions, error handling, schema/types, testing.

## AI SDK 6 Beta
`ToolLoopAgent` with call options. Tool execution approval. Structured output with tool calling. Reranking support. Image editing coming soon. Minimal breaking changes from v5.