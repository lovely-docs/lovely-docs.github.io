## Data Migration to AI SDK 5.0

Two-phase migration approach for persisted messages from v4 to v5 format.

### Message Structure Changes
- v4: `content`, `reasoning`, `toolInvocations` as top-level fields
- v5: `parts` array is single source of truth; `reasoning` and `toolInvocations` become parts; tool state mapping: `partial-call` → `input-streaming`, `call` → `input-available`, `result` → `output-available`

### Phase 1: Runtime Conversion (Immediate)
Install v4 types alongside v5: `"ai-legacy": "npm:ai@^4.3.2"`. Create bidirectional converters (`convertV4MessageToV5`, `convertV5MessageToV4`) with type guards. Convert on read from database and on write before saving:
```tsx
// Read: v4 database → v5 app
const messages = await db.select().from(messages);
return messages.map((msg, i) => convertV4MessageToV5(msg, i));

// Write: v5 app → v4 database
await upsertMessage({ chatId, id: message.id, message: convertV5MessageToV4(message) });
```

### Phase 2: Schema Migration (Do Soon After)
1. Create `messages_v5` table alongside `messages`
2. Dual-write new messages to both schemas with conversion
3. Background migration script in batches (can resume safely):
```typescript
const unmigrated = allMessages.filter(msg => !migratedIdSet.has(msg.id));
for (let i = 0; i < unmigrated.length; i += 100) {
  await db.transaction(async tx => {
    for (const msg of batch) {
      const v5Message = convertV4MessageToV5(msg, 0);
      await tx.insert(messages_v5).values(v5Message);
    }
  });
}
```
4. Verify: count messages in both schemas
5. Switch reads to `messages_v5` (no conversion needed)
6. Stop dual-write, write only to `messages_v5`
7. Drop old table

Adapt all code examples to your database, ORM, and schema design.