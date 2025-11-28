Hook for reading and updating UI state on the client side. The UI state is the visual representation of AI state and can contain functions, React nodes, and other data.

Returns an array similar to useState with two elements: the current UI state and a function to update it.

Import: `import { useUIState } from "@ai-sdk/rsc"`

Note: AI SDK RSC is experimental; AI SDK UI is recommended for production. Migration guide available for transitioning from RSC to UI.

Example use case: Managing AI and UI states in Next.js applications.