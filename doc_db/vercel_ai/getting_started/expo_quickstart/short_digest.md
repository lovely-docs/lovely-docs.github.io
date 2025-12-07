## Expo Quickstart

Setup: `pnpm create expo-app@latest my-ai-app && pnpm add ai@beta @ai-sdk/react@beta zod`. Set `AI_GATEWAY_API_KEY` in `.env.local`.

API route `app/api/chat+api.ts` uses `streamText()` with model and messages, returns `result.toUIMessageStreamResponse()`.

UI uses `useChat` hook with `DefaultChatTransport` using `expo/fetch`. Hook provides `messages` (with `parts` array), `sendMessage()`, `error`. Display message parts by type (text, tool results).

Create `utils.ts` with `generateAPIUrl()` for dev/prod URL handling. Set `EXPO_PUBLIC_API_BASE_URL` for production.

Tools: Define in `tools` object with `description`, `inputSchema` (Zod), async `execute()`. Use `stopWhen: stepCountIs(5)` for multi-step tool calls. Tool parts named `tool-{toolName}`. Update UI switch statement to handle tool part types.

Polyfills: Install `@ungap/structured-clone @stardazed/streams-text-encoding`, create `polyfills.js` with `structuredClone`, `TextEncoderStream`, `TextDecoderStream` polyfills, import in `_layout.tsx`.