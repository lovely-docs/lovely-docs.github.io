**AI State**: Use `onSetAIState` callback to save state to database when `done` is true. Restore with `initialAIState` prop in root layout.

**UI State**: Cannot be saved directly (not serializable). Use `onGetUIState` callback to reconstruct UI from AI state by comparing database history with app state and returning mapped components when they differ.