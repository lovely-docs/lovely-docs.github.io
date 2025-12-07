## Message Types
- **SystemModelMessage**: `{ role: 'system'; content: string }`
- **UserModelMessage**: `{ role: 'user'; content: string | TextPart | ImagePart | FilePart[] }`
- **AssistantModelMessage**: `{ role: 'assistant'; content: string | TextPart | ToolCallPart[] }`
- **ToolModelMessage**: `{ role: 'tool'; content: ToolResultPart[] }`

## Content Parts
- **TextPart**: `{ type: 'text'; text: string }`
- **ImagePart**: `{ type: 'image'; image: base64|Uint8Array|Buffer|URL; mediaType?: string }`
- **FilePart**: `{ type: 'file'; data: base64|Uint8Array|Buffer|URL; filename?: string; mediaType: string }`
- **ToolCallPart**: `{ type: 'tool-call'; toolCallId: string; toolName: string; args: unknown }`
- **ToolResultPart**: `{ type: 'tool-result'; toolCallId: string; toolName: string; output: ToolResultOutput; providerOptions?: ProviderOptions }`

## Tool Result Output Types
`text | json | execution-denied | error-text | error-json | content` (content supports text, file-data/url/id, image-data/url/id, custom)