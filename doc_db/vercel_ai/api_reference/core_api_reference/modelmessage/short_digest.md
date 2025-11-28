## Message Types

`ModelMessage` is the fundamental message structure for AI SDK Core functions. Four main types:

- **SystemModelMessage**: `{ role: 'system'; content: string }`
- **UserModelMessage**: `{ role: 'user'; content: string | Array<TextPart | ImagePart | FilePart> }`
- **AssistantModelMessage**: `{ role: 'assistant'; content: string | Array<TextPart | ToolCallPart> }`
- **ToolModelMessage**: `{ role: 'tool'; content: Array<ToolResultPart> }`

## Message Parts

- **TextPart**: `{ type: 'text'; text: string }`
- **ImagePart**: `{ type: 'image'; image: DataContent | URL; mediaType?: string }`
- **FilePart**: `{ type: 'file'; data: DataContent | URL; filename?: string; mediaType: string }`
- **ToolCallPart**: `{ type: 'tool-call'; toolCallId: string; toolName: string; args: unknown }`
- **ToolResultPart**: `{ type: 'tool-result'; toolCallId: string; toolName: string; output: ToolResultOutput; providerOptions?: ProviderOptions }`

**ToolResultOutput** variants: `text`, `json`, `execution-denied`, `error-text`, `error-json`, `content` (with text, file-data, file-url, file-id, image-data, image-url, image-file-id, custom parts).