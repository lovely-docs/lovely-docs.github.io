# UIMessage

Application state container with message history, metadata, and data parts. Three generic parameters: METADATA, DATA_PARTS, TOOLS.

Core interface has `id`, `role` ('system'|'user'|'assistant'), optional `metadata`, and `parts` array.

Part types: TextUIPart (text + state), ReasoningUIPart (reasoning + state), ToolUIPart (tool invocations with input/output states), SourceUrlUIPart, SourceDocumentUIPart, FileUIPart (with mediaType and url), DataUIPart (custom types), StepStartUIPart.

Example custom type:
```typescript
const metadataSchema = z.object({ someMetadata: z.string().datetime() });
const dataPartSchema = z.object({ someDataPart: z.object({}), anotherDataPart: z.object({}) });
const tools = { someTool: tool({}) } satisfies ToolSet;
export type MyUIMessage = UIMessage<z.infer<typeof metadataSchema>, z.infer<typeof dataPartSchema>, InferUITools<typeof tools>>;
```