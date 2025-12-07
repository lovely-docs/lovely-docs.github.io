## Problem
`useChat` no longer supports direct `headers`, `body`, `credentials` options.

## Solutions
1. **Request-level (recommended for dynamic)**: Pass options to `sendMessage()`
2. **Hook-level static**: Use `DefaultChatTransport` with static values
3. **Hook-level dynamic**: Use `DefaultChatTransport` with function callbacks

Request-level options override hook-level options. For changing component state, prefer request-level configuration.