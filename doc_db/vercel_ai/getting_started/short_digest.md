**SDK Overview**: Three components - Core (unified LLM API for any JS env), UI (streaming chat/generative UI hooks for React/Vue/Svelte), RSC (server-to-client streaming for Next.js App Router, experimental).

**Quickstarts** for each environment:
- **Next.js App Router**: `streamText()` route handler with `useChat()` hook, tools with Zod schemas, multi-step execution via `stopWhen: stepCountIs(5)`
- **Next.js Pages Router**: Same pattern as App Router
- **Node.js**: CLI chat agent with `streamText()`, message history, tools with `execute` functions, `onStepFinish` callback
- **Svelte**: `Chat` class (reference-based reactivity), API route with `createGateway()`, tool parts as `tool-{toolName}`
- **Nuxt/Vue**: `Chat` class with `useChat()` hook, runtime config for API key
- **Expo**: `useChat()` with `DefaultChatTransport` and `expo/fetch`, requires polyfills for `structuredClone` and text encoding

**Common patterns**: 
- `streamText({ model, messages, tools?, stopWhen? })` returns result with `toUIMessageStreamResponse()` or `textStream`
- `convertToModelMessages()` strips UI metadata from `UIMessage[]`
- Tools defined with `tool({ description, inputSchema: z.object(...), execute })`, appear as `tool-{name}` parts
- `stopWhen: stepCountIs(N)` enables multi-step tool calling
- Default provider is Vercel AI Gateway (string model refs like `'anthropic/claude-sonnet-4.5'`), or import specific providers like `openai`