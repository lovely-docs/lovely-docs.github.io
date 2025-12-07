## Migrating from AI SDK RSC to AI SDK UI

AI SDK RSC is experimental with production-blocking limitations (stream abort, component remount flicker, suspense crashes, quadratic data transfer, closed stream issues). AI SDK UI is the stable alternative.

**Chat Completions:** Replace `streamUI` server action with `streamText` route handler + `useChat` client hook.

**Tool Calls:** UI `useChat` natively supports parallel and multi-step tool calls (set `maxSteps`); RSC requires manual workarounds.

**Generative UI:** Stream props data from server tools, render components client-side using `message.toolInvocations` with state checking (pending vs result).

**Client Interactions:** Initialize `useChat` with same `id` in child components to sync messages; use `append()` instead of `useActions`.

**Loading States:** Use tool invocation `state` property (pending/result) instead of `initial` parameter.

**Saving/Restoring:** Use `onFinish` callback in `streamText` to save; load messages via `initialMessages` prop during page generation.

**Object Generation:** Replace `createStreamableValue` + `streamObject` with `useObject` hook + route handler `streamObject`.