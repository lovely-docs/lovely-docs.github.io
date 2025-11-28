## Key Changes

**Providers**: `baseUrl` → `baseURL`, remove facade constructors (`new Anthropic()` → `createAnthropic()`), move model-specific `topK` to standard parameter

**Core**: Remove `await` from `streamText`/`streamObject`, replace `maxToolRoundtrips` with `maxSteps` (roundtrips + 1), `nanoid` → `generateId`, experimental exports removed

**Types**: `ExperimentalMessage` → `ModelMessage`, `ExperimentalTool` → `CoreTool`, `TokenUsage` → `LanguageModelUsage`

**Methods**: `toAIStream()` → `toDataStream()`, `formatStreamPart()` → `formatDataStreamPart()`, `parseStreamPart()` → `parseDataStreamPart()`

**Properties**: `rawResponse` → `response`, `responseMessages` → `response.messages`, `roundtrips` → `steps`, `warnings` now Promise

**UI Hooks**: `streamMode` → `streamProtocol`, remove `options` parameter, `experimental_addToolResult()` → `addToolResult()`, `setInput()` → `submit()`

**Frameworks**: Svelte/Vue/SolidJS imports move to separate packages

**Errors**: `APICallError.isAPICallError()` → `APICallError.isInstance()`

Run `npx @ai-sdk/codemod upgrade` for automated fixes.