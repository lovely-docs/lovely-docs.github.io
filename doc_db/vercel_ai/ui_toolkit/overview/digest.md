AI SDK UI is a framework-agnostic toolkit for building interactive chat, completion, and assistant applications. It provides three main hooks:

- **useChat**: Real-time streaming of chat messages with abstracted state management for inputs, messages, loading, and errors. Enables seamless integration into any UI design.
- **useCompletion**: Handles text completions by managing prompt input and automatically updating the UI as new completions are streamed.
- **useObject**: Consumes streamed JSON objects, providing a simple way to handle and display structured data.

These hooks reduce complexity in implementing AI interactions by managing chat streams and UI updates on the frontend.

**Framework Support**: React, Svelte, Vue.js, and Angular are supported. All frameworks support useChat and useCompletion. useObject is supported in React, Svelte, and Angular, but not Vue.js.

**Example Implementations**: Next.js, Nuxt, SvelteKit, and Angular examples are available in the repository.