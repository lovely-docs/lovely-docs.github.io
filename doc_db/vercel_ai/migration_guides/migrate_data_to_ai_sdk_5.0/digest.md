## Data Migration Strategy for AI SDK 5.0

AI SDK 5.0 changes the message structure from v4, requiring data migration. The guide provides a two-phase approach to migrate persisted messages and chat data.

### Key Message Structure Changes

**AI SDK 4.0 format:**
- `content` field for text
- `reasoning` as top-level property
- `toolInvocations` as top-level property
- `parts` optional ordered array

**AI SDK 5.0 format:**
- `parts` array is the single source of truth
- `content` removed (access via `text` part)
- `reasoning` removed (replaced with `reasoning` part)
- `toolInvocations` removed (replaced with `tool-${toolName}` parts with `input`/`output` instead of `args`/`result`)
- `data` role removed (use data parts instead)

### Phase 1: Runtime Conversion (Hours to Days)

Get your app working immediately without database changes by adding a conversion layer.

**Setup:**
1. Install v4 types alongside v5 using npm aliases in package.json:
```json
{
  "dependencies": {
    "ai": "^5.0.0",
    "ai-legacy": "npm:ai@^4.3.2"
  }
}
```

2. Import types:
```tsx
import type { Message as V4Message } from 'ai-legacy';
import type { UIMessage } from 'ai';
```

**Conversion functions:** Create type guards (`isV4Message`, `isV4ToolInvocationPart`, etc.) and bidirectional converters:
- `convertV4MessageToV5()`: Transform v4 messages to v5 format
- `convertV5MessageToV4()`: Transform v5 messages to v4 format
- `convertV4ToolInvocationToV5ToolUIPart()`: Handle tool invocation state mapping (`partial-call` → `input-streaming`, `call` → `input-available`, `result` → `output-available`)
- Part converters for reasoning, source, and file parts

**Apply conversion on read:**
```tsx
export async function loadChat(chatId: string): Promise<MyUIMessage[]> {
  const rawMessages = await db.select().from(messages).where(eq(messages.chatId, chatId));
  return rawMessages.map((msg, index) => convertV4MessageToV5(msg, index));
}
```

**Apply conversion on write:**
```tsx
export async function POST(req: Request) {
  const { message, chatId } = await req.json();
  await upsertMessage({
    chatId,
    id: message.id,
    message: convertV5MessageToV4(message), // convert to v4 before saving
  });
  const previousMessages = await loadChat(chatId);
  const messages = [...previousMessages, message];
  // ... rest of streamText logic
}
```

Result: Bidirectional conversion layer (v4 database ↔ v5 application) with unchanged database schema.

### Phase 2: Side-by-Side Schema Migration (Do Soon After Phase 1)

Migrate data to v5 schema to eliminate runtime conversion overhead.

**Migration strategy:**
1. Create `messages_v5` table alongside existing `messages` table with same structure but storing v5 message parts
2. Implement dual-write for new messages to both schemas (with conversion)
3. Run background migration script to convert existing messages in batches
4. Verify data integrity (count messages in both schemas, check migration progress)
5. Update read functions to use `messages_v5` schema (no conversion needed since data is already v5)
6. Stop dual-writing, write only to `messages_v5`
7. Drop old `messages` table

**Dual-write implementation:**
```typescript
export const upsertMessage = async ({ chatId, message, id }) => {
  return await db.transaction(async tx => {
    // Write to v4 schema
    const [result] = await tx.insert(messages).values({
      chatId, parts: message.parts ?? [], role: message.role, id
    }).onConflictDoUpdate({ target: messages.id, set: { parts: message.parts ?? [], chatId } }).returning();
    
    // Convert and write to v5 schema
    const v5Message = convertV4MessageToV5({ ...message, content: '' }, 0);
    await tx.insert(messages_v5).values({
      chatId, parts: v5Message.parts ?? [], role: v5Message.role, id
    }).onConflictDoUpdate({ target: messages_v5.id, set: { parts: v5Message.parts ?? [], chatId } });
    
    return result;
  });
};
```

**Background migration script:**
```typescript
async function migrateExistingMessages() {
  const migratedIds = await db.select({ id: messages_v5.id }).from(messages_v5);
  const migratedIdSet = new Set(migratedIds.map(m => m.id));
  const allMessages = await db.select().from(messages);
  const unmigrated = allMessages.filter(msg => !migratedIdSet.has(msg.id));
  
  const batchSize = 100;
  for (let i = 0; i < unmigrated.length; i += batchSize) {
    const batch = unmigrated.slice(i, i + batchSize);
    await db.transaction(async tx => {
      for (const msg of batch) {
        const v5Message = convertV4MessageToV5({ id: msg.id, content: '', role: msg.role, parts: msg.parts, createdAt: msg.createdAt }, 0);
        await tx.insert(messages_v5).values({ id: v5Message.id, chatId: msg.chatId, role: v5Message.role, parts: v5Message.parts, createdAt: msg.createdAt });
      }
    });
  }
}
```

**Verification script:**
```typescript
async function verifyMigration() {
  const v4Count = await db.select({ count: count() }).from(messages);
  const v5Count = await db.select({ count: count() }).from(messages_v5);
  console.log(`V4: ${v4Count[0].count}, V5: ${v5Count[0].count}, Progress: ${((v5Count[0].count / v4Count[0].count) * 100).toFixed(2)}%`);
}
```

**After migration, update read functions:**
```typescript
export const loadChat = async (chatId: string): Promise<MyUIMessage[]> => {
  return await db.select().from(messages_v5).where(eq(messages_v5.chatId, chatId)).orderBy(messages_v5.createdAt);
};
```

**Update route handler to write v5 directly:**
```tsx
export async function POST(req: Request) {
  const { message, chatId } = await req.json();
  await upsertMessage({ chatId, id: message.id, message }); // no conversion
  const previousMessages = await loadChat(chatId);
  const messages = [...previousMessages, message];
  // ... streamText logic
}
```

**Cleanup:**
- Remove conversion functions and `ai-legacy` dependency
- Test thoroughly
- After safe period (1-2 weeks), drop old table: `DROP TABLE messages;`
- Optionally rename: `ALTER TABLE messages_v5 RENAME TO messages;`

### Implementation Notes

- Adapt all examples to your specific database (Postgres, MySQL, SQLite), ORM (Drizzle, Prisma, raw SQL), and schema design
- Phase 1 can be completed in hours/days; Phase 2 should follow soon after
- The conversion layer handles all v4 message types including tool invocations with state mapping, reasoning parts, source parts, and file parts
- Batch migration script can be run multiple times safely and supports resuming
- Dual-write ensures no data loss during migration period