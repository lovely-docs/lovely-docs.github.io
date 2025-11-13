## Changelog Entry Format

All changelog entries follow this structure:
```
- <type>(<scope>): <description>
```

### Type
- `fix`: Resolves a bug or issue
- `feat`: Adds a new feature or enhancement
- `improve`: Enhances existing functionality without fixing a bug
- `chore`: Internal refactors, cleanups, or tooling changes with no user-facing impact
- `docs`: Changes to documentation in the codebase (JSdoc comments only; documentation site changes don't require entries)

### Scope
- Use component name (e.g., `Select`, `Tooltip`, `Calendar`) for component-specific changes
- Use general term (e.g., `all`, `SSR`) for multi-component or cross-cutting changes
- Omit scope only for truly global changes (rare)

### Description
- Concise, lowercase phrase without period
- Start with a verb where possible
- Use backticks for code like prop names and types
- Be specific; avoid vague terms
- Target 10-15 words max

### Examples
```
fix(Select.Trigger): improve accessibility for screen readers and keyboard navigation
fix(Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true`
chore(Menubar.Content): simplify internal implementation for maintainability
```