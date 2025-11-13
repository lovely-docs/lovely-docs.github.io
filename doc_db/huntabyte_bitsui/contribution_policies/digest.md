## Changelog Entry Format

Changelog entries follow the structure: `- <type>(<scope>): <description>`

**Types:**
- `fix`: Bug or issue resolution
- `feat`: New feature or enhancement
- `improve`: Existing functionality enhancement
- `chore`: Internal refactors or tooling with no user-facing impact
- `docs`: JSDoc documentation changes only

**Scope:** Component name (e.g., `Select`, `Tooltip`) for component-specific changes, or general term (e.g., `all`, `SSR`) for cross-cutting changes. Omit for truly global changes.

**Description:** Concise, lowercase phrase without period; start with a verb; use backticks for code; target 10-15 words max.

Example: `fix(Select.Trigger): improve accessibility for screen readers and keyboard navigation`

## Issues vs Discussions

**Issues:** Reproducible bugs with clear steps and error messages, or accepted feature requests approved for implementation.

**Discussions:** Feature requests (starting point), design discussions, questions, and RFCs.

**Feature Request Workflow:**
1. Start Discussion describing feature and benefits
2. Gather feedback and refine
3. If consensus reached, maintainer creates Issue for implementation tracking