## AI State

**Saving AI state**: Use the `onSetAIState` callback in `createAI` to persist state whenever it updates. The callback receives `{ state, done }` and runs on the server. Save to database when `done` is true:

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: { continueConversation },
  onSetAIState: async ({ state, done }) => {
    'use server';
    if (done) {
      saveChatToDB(state);
    }
  },
});
```

**Restoring AI state**: Pass `initialAIState` prop to the AI context provider in your root layout. Load from database and pass the chat history:

```tsx
export default async function RootLayout({ children }) {
  const chat = await loadChatFromDB();
  return (
    <html>
      <body>
        <AI initialAIState={chat}>{children}</AI>
      </body>
    </html>
  );
}
```

## UI State

**Saving UI state**: UI state cannot be saved directly because it's not serializable. Use AI state as a proxy to store metadata about UI state instead.

**Restoring UI state**: Use the `onGetUIState` callback to listen for SSR events and reconstruct UI state from AI state. Load chat history from database and compare with current app state. If they differ (different lengths), return reconstructed UI state with rendered components:

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: { continueConversation },
  onGetUIState: async () => {
    'use server';
    const historyFromDB = await loadChatFromDB();
    const historyFromApp = getAIState();
    
    if (historyFromDB.length !== historyFromApp.length) {
      return historyFromDB.map(({ role, content }) => ({
        id: generateId(),
        role,
        display: role === 'function' ? <Component {...JSON.parse(content)} /> : content,
      }));
    }
  },
});
```

Note: AI SDK RSC is experimental; use AI SDK UI for production.