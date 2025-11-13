`{@debug ...}` logs variable values on change and pauses execution with devtools open. Accepts comma-separated variable names only:
```svelte
{@debug user}
{@debug user1, user2, user3}
```
Use `{@debug}` without arguments to trigger on any state change.