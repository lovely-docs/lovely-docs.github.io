## Three Components

- **Core**: Unified LLM API (generateText, generateObject) for any JS environment
- **UI**: Hooks (useChat, useCompletion, useObject) for React/Vue/Svelte frameworks
- **RSC**: Server-to-client streaming with React Server Components (experimental, not recommended for production)

## Compatibility Matrix

Core works everywhere. UI works in React/Vue/Svelte. RSC only in Next.js App Router.

UI framework support: useChat/useCompletion in all three; tool calling only React/Svelte; useObject only React.

Choose Core for backend/universal code, UI for frontend chat/generative UIs, RSC for Next.js server streaming (with caveats).
