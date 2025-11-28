## Purpose
`pruneMessages()` filters and reduces an array of `ModelMessage` objects to optimize context size before sending to an LLM. Common use cases include reducing token count, removing intermediate reasoning, and trimming tool calls and empty messages.

## API Signature
```ts
pruneMessages(options: {
  messages: ModelMessage[]
  reasoning?: 'all' | 'before-last-message' | 'none'
  toolCalls?: 'all' | 'before-last-message' | 'before-last-${number}-messages' | 'none' | PruneToolCallsOption[]
  emptyMessages?: 'keep' | 'remove'
}): ModelMessage[]
```

## Parameters
- **messages**: Array of ModelMessage objects to prune (required)
- **reasoning**: Controls removal of reasoning content from assistant messages
  - `'all'`: Remove all reasoning parts
  - `'before-last-message'`: Keep reasoning only in the last message
  - `'none'`: Retain all reasoning (default)
- **toolCalls**: Prunes tool-call, tool-result, and tool-approval chunks
  - `'all'`: Remove all tool-related content
  - `'before-last-message'`: Remove except in last message
  - `'before-last-N-messages'`: Remove except in last N messages
  - `'none'`: Do not prune
  - Or pass array of `PruneToolCallsOption[]` for per-tool control
- **emptyMessages**: `'keep'` or `'remove'` (default: `'remove'`) - whether to keep messages with no content after pruning

## Returns
Array of pruned `ModelMessage` objects

## Example
```ts
import { pruneMessages, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const prunedMessages = pruneMessages({
    messages,
    reasoning: 'before-last-message',
    toolCalls: 'before-last-2-messages',
    emptyMessages: 'remove',
  });

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: prunedMessages,
  });

  return result.toUIMessageStreamResponse();
}
```

## Use Cases
- Reduce token consumption by removing reasoning from all but the last message
- Remove tool calls except those in recent messages
- Clean up empty messages after pruning
- Fine-grained control per tool using array option