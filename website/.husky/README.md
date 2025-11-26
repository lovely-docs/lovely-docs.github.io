# Git Hooks

This directory contains Git hooks managed by Husky.

## Pre-commit Hook

The pre-commit hook runs `bun run check` before every commit to ensure:
- TypeScript type checking passes
- Svelte component type checking passes

If the check fails, the commit will be aborted.

## Setup

The hooks are configured via `git config core.hooksPath .husky`.

For new clones or worktrees, run:
```bash
git config core.hooksPath .husky
```

Or run the prepare script:
```bash
bun run prepare
```

Note: The `husky` command in the prepare script may not work in git worktrees,
but the manual `git config` command above will work fine.
