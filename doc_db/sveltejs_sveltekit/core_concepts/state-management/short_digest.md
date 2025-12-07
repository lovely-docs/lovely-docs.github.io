**Avoid shared state on server** — never store user data in shared variables; use cookies and databases instead.

**No side-effects in load** — don't write to stores/global state; return data instead.

**Use context API** — pass state via `setContext`/`getContext` to avoid globals; pass functions for reactivity.

**Component state is preserved** — use `$derived` to recalculate when props change; use `{#key}` to force remount.

**URL for persistent state** — store filters/sorting in search params via `goto()` or form attributes.

**Snapshots for ephemeral state** — persist UI state (accordion open) across navigation without reload.