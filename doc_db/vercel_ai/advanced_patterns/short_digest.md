**Prompt Engineering**: Use specific instructions, examples, and temperature (0=deterministic, 1=creative) to shape LLM responses.

**Stream Control**: Cancel with `abortSignal` (server) or `stop()` (client); use `pull()` handler for back-pressure to prevent memory leaks on client disconnect.

**Caching**: Middleware with `wrapGenerate`/`wrapStream` or `onFinish` callbacks; replay with `simulateReadableStream()`.

**Multiple Streamables**: Return multiple independent UI components that update as async data resolves; nest streamables as props for sequential updates.

**Rate Limiting**: Use Vercel KV + Upstash Ratelimit with fixed window limiter, check IP-based limits, return 429 on exceeded threshold.

**UI Rendering**: Tools return JSON instead of text; use `createStreamableUI()` server-side to render React components and stream to client, eliminating client-side conditional logic.

**Models as Routers**: Function calling enables models to decide which operations/UIs to render based on user intent (parameter-based or sequential multi-step routing).

**Multistep Interfaces**: Compose tools and manage application context so model output in one step uses information from previous steps.

**Sequential Generations**: Chain multiple AI calls where each output becomes next prompt input for dependent workflows.

**Deployment**: Commit to GitHub, import to Vercel, add env vars, set `maxDuration` for LLM timeouts, implement rate limiting and firewall.