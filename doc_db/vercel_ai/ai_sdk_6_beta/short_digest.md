## AI SDK 6 Beta

Major version bump due to v3 Language Model Specification, but minimal breaking changes from v5. Install: `npm install ai@beta @ai-sdk/openai@beta @ai-sdk/react@beta`

**Agent Abstraction** - New `Agent` interface with `ToolLoopAgent` default implementation that automatically handles tool execution loops. Supports call options for dynamic runtime configuration, UI integration with React, and custom implementations.

**Tool Execution Approval** - Set `needsApproval: true` on tools for human-in-the-loop patterns. Supports dynamic approval based on tool input and client-side approval UI with auto-submit after approvals.

**Structured Output (Stable)** - `ToolLoopAgent`, `generateText`, and `streamText` now support structured output via `output` parameter alongside tool calling. Supports `Output.object()`, `Output.array()`, `Output.choice()`, `Output.text()`. Streaming available with `agent.stream()`.

**Reranking Support** - Native reranking to improve search relevance by reordering documents based on query-document relationships. Supports both plain text and structured documents. Providers: Cohere, Amazon Bedrock, Together.ai.

**Image Editing Support** - Coming soon for image-to-image transformations and multi-modal editing.

**Timeline**: Beta now, stable release end of 2025.