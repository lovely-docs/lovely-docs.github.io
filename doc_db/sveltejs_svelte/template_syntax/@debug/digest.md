The `{@debug ...}` tag logs variable values whenever they change and pauses execution if devtools are open, serving as an alternative to `console.log()`.

**Usage:**
- Accepts comma-separated variable names only (not expressions):
```svelte
{@debug user}
{@debug user1, user2, user3}
```

- Does NOT work with property access, array indexing, or expressions:
```svelte
{@debug user.firstname}        // Won't compile
{@debug myArray[0]}            // Won't compile
{@debug !isReady}              // Won't compile
{@debug typeof user === 'object'}  // Won't compile
```

- `{@debug}` without arguments inserts a `debugger` statement triggered on any state change.