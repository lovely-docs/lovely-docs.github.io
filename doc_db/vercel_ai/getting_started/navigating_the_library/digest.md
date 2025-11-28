The AI SDK consists of three main components:

**AI SDK Core**: Unified, provider-agnostic API for generating text, structured objects, and tool calls with LLMs. Works in any JavaScript environment (Node.js, Deno, Browser). Provides functions like `generateText` and `generateObject`.

**AI SDK UI**: Framework-agnostic hooks for building streaming chat and generative UIs. Supports React, Svelte, and Vue.js. Provides production-ready utilities for common AI interaction patterns (chat, completion, assistant). Supported functions:
- `useChat` (all frameworks, tool calling in React/Svelte only)
- `useCompletion` (all frameworks)
- `useObject` (React only)

**AI SDK RSC**: Streams generative UIs from server to client using React Server Components. Currently experimental; recommended for Next.js App Router only. Provides `streamUI`, `createStreamableUI`, and `createStreamableValue`. Has limitations: no stream cancellation via Server Actions, potential quadratic data transfer with `createStreamableUI`, component re-mounting causes flickering during streaming.

**Environment Compatibility**:
- Node.js/Deno: Core only
- Vue/Nuxt: Core + UI
- Svelte/SvelteKit: Core + UI
- Next.js Pages Router: Core + UI
- Next.js App Router: Core + UI + RSC

**When to use each**:
- Core: Any backend or universal JavaScript environment
- UI: Building production-ready streaming chat/generative interfaces across React, Vue, Svelte frameworks
- RSC: Experimental server-to-client streaming in Next.js App Router (not recommended for production; use UI instead)