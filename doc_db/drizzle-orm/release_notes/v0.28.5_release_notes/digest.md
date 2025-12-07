## v0.28.5 Release

**Fix:** Corrected incorrect OpenTelemetry type import that caused a runtime error.

**Details:** The issue was caused by using `import { type ... }` syntax instead of `import type { ... }` on the tracing.ts file, which caused the `import '@opentelemetry/api'` line to leak into runtime code.

**Context:** OpenTelemetry integration in drizzle-orm is currently disabled and does nothing. It was an experimental feature designed to allow users to collect query statistics and send them to their own telemetry consumers. The ORM itself never collects or sends any stats. OpenTelemetry is simply a protocol that the library provides hooks for, but the feature is not active in current versions.