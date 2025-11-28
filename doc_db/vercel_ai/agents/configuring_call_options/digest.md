Call options enable type-safe runtime configuration of agent behavior through structured inputs. Define them in three steps: specify inputs with `callOptionsSchema` using Zod, configure agent settings in `prepareCall` function, and pass options when calling `generate()` or `stream()`.

**Dynamic Context Injection**: Add user data to prompts at runtime. Define schema with user properties, modify instructions in `prepareCall` to include context, pass options when generating.

**Dynamic Model Selection**: Choose models based on request characteristics. Use `prepareCall` to return different model based on complexity option - e.g., use gpt-4o-mini for simple queries, o1-mini for complex reasoning.

**Dynamic Tool Configuration**: Adjust tool behavior per request. Configure tools in `prepareCall` with runtime values like user location for search tools or context size adjustments.

**Provider-Specific Options**: Set provider settings dynamically like OpenAI's reasoningEffort based on task difficulty via `providerOptions` in `prepareCall`.

**Retrieval Augmented Generation (RAG)**: `prepareCall` can be async - fetch relevant documents via vector search and inject into instructions before agent execution.

**Combining Multiple Modifications**: Modify model, tools, and instructions together in single `prepareCall` - e.g., upgrade model for urgent requests, limit tools by user role, adjust instructions based on context.

**API Integration**: Pass call options through `createAgentUIStreamResponse` in API routes by including them in the options parameter alongside agent and messages.

The `options` parameter becomes required and type-checked when `callOptionsSchema` is defined. TypeScript enforces correct types at call sites.