## UIMessage

Application state representation for message history with metadata, data parts, and contextual information. Accepts three generic parameters: METADATA, DATA_PARTS, and TOOLS for type safety.

### Interface

```typescript
interface UIMessage<METADATA = unknown, DATA_PARTS extends UIDataTypes = UIDataTypes, TOOLS extends UITools = UITools> {
  id: string;
  role: 'system' | 'user' | 'assistant';
  metadata?: METADATA;
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>;
}
```

### Message Part Types

- **TextUIPart**: `{ type: 'text'; text: string; state?: 'streaming' | 'done' }`
- **ReasoningUIPart**: `{ type: 'reasoning'; text: string; state?: 'streaming' | 'done'; providerMetadata? }`
- **ToolUIPart**: `{ type: 'tool-${NAME}'; toolCallId: string; state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error'; input; output?; errorText? }`
- **SourceUrlUIPart**: `{ type: 'source-url'; sourceId: string; url: string; title?; providerMetadata? }`
- **SourceDocumentUIPart**: `{ type: 'source-document'; sourceId: string; mediaType: string; title: string; filename? }`
- **FileUIPart**: `{ type: 'file'; mediaType: string; filename?; url: string }`
- **DataUIPart**: `{ type: 'data-${NAME}'; id?; data: DATA_TYPES[NAME] }`
- **StepStartUIPart**: `{ type: 'step-start' }`

### Custom Type Example

```typescript
const metadataSchema = z.object({ someMetadata: z.string().datetime() });
type MyMetadata = z.infer<typeof metadataSchema>;

const dataPartSchema = z.object({ someDataPart: z.object({}), anotherDataPart: z.object({}) });
type MyDataPart = z.infer<typeof dataPartSchema>;

const tools = { someTool: tool({}) } satisfies ToolSet;
type MyTools = InferUITools<typeof tools>;

export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;
```