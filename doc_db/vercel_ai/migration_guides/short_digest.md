## Versioning
- **Stable**: Production-ready, backward compatible
- **Experimental** (`experimental_` prefix): Can change in any release, pin exact versions
- **Deprecated**: Removed in future major versions with migration guides

## 4.x → 5.0 (Major Changes)
- Message structure: `content`/`reasoning`/`toolInvocations` → `parts` array with typed objects
- `maxTokens` → `maxOutputTokens`, `CoreMessage` → `ModelMessage`
- `parameters` → `inputSchema`, `args`/`result` → `input`/`output`
- `maxSteps` → `stopWhen`, stream protocol: chunks → start/delta/end pattern
- UI: `ai/rsc` → `@ai-sdk/rsc`, `useChat`: `append()` → `sendMessage()`, `reload()` → `regenerate()`
- Data migration: Two-phase (runtime conversion layer, then schema migration with dual-write)

## 3.4 → 4.0
- `baseUrl` → `baseURL`, remove `await` from `streamText`/`streamObject`
- `maxToolRoundtrips` → `maxSteps`, `ExperimentalMessage` → `ModelMessage`
- `toAIStream()` → `toDataStream()`, `rawResponse` → `response`
- Framework exports split to separate packages

## 4.1 → 4.2
- Stabilize APIs (remove `experimental_` prefix)
- Message structure: combine into single message with `parts` array

## 5.0 → 6.0 Beta
- Update to `@beta` versions, introduces agents and tool approval

## Migration Process
1. Backup and commit
2. Upgrade packages
3. Run codemods: `npx @ai-sdk/codemod upgrade`
4. Manually fix remaining changes
5. Verify and commit