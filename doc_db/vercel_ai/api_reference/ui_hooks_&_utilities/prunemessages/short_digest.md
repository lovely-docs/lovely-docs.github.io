## `pruneMessages()`
Filters `ModelMessage[]` arrays to reduce context size before sending to LLM.

**Parameters:**
- `messages`: Array to prune
- `reasoning`: `'all' | 'before-last-message' | 'none'` - remove reasoning content
- `toolCalls`: `'all' | 'before-last-message' | 'before-last-${number}-messages' | 'none' | PruneToolCallsOption[]` - prune tool calls/results/approvals
- `emptyMessages`: `'keep' | 'remove'` - handle empty messages after pruning

**Returns:** Pruned `ModelMessage[]`

**Example:**
```ts
const prunedMessages = pruneMessages({
  messages,
  reasoning: 'before-last-message',
  toolCalls: 'before-last-2-messages',
  emptyMessages: 'remove',
});
```