

## Pages

### changelog-conventions
Guidelines for writing consistent changelog entries using changesets with type, scope, and description format.

Changelog entries use format: `- <type>(<scope>): <description>`

Types: `fix`, `feat`, `improve`, `chore`, `docs`
Scope: component name or general term (omit if global)
Description: concise, lowercase, verb-first, 10-15 words max, use backticks for code

Example: `fix(Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true``

### tracking-bugs-and-feature-requests
GitHub Issues track confirmed bugs and accepted feature requests; Discussions are for proposing and refining features before implementation.

**Issues**: Reproducible bugs and accepted feature requests ready for implementation.

**Discussions**: Feature requests, design discussions, questions, and brainstorming before any code is written.

Feature requests must start as Discussions and only become Issues after maintainer approval and consensus.

