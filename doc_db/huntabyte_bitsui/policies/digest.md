## Changelog Entry Format

All changelog entries follow the structure: `- <type>(<scope>): <description>`

**Types:**
- `fix`: Resolves a bug or issue
- `feat`: Adds a new feature or enhancement (Minor or Major release)
- `improve`: Enhances existing functionality without fixing a bug
- `chore`: Internal refactors, cleanups, or tooling changes with no user-facing impact
- `docs`: Changes to documentation in the codebase (JSdoc comments); documentation site changes don't require entries

**Scope:** Use component name (e.g., `Select`, `Tooltip`, `Calendar`) for component-specific changes, general terms (e.g., `all`, `SSR`) for multi-component changes, or omit for truly global changes.

**Description:** Concise, lowercase phrase starting with a verb where possible. Use backticks for code (prop names, types, values). Target 10-15 words max.

Examples:
- `fix(Select.Trigger): improve accessibility for screen readers and keyboard navigation`
- `fix(Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true``
- `chore(Menubar.Content): simplify internal implementation for maintainability`

## Issues vs Discussions Policy

**Issues** are for reproducible bugs with clear steps, error messages, screenshots, and expected vs actual behavior; confirmed problems; and accepted feature requests that have been discussed, refined, and approved.

**Discussions** are for feature requests (starting point), design discussions, questions, brainstorming, and RFCs.

**Feature Request Workflow:**
1. Start a Discussion describing the feature, benefits, and potential challenges
2. Gather feedback and refine based on community input
3. If consensus is reached and deemed valuable, maintainer determines next steps
4. Once accepted for implementation, create an Issue to track progress

If a feature request is opened as an Issue, the maintainer converts it to a Discussion (if not yet accepted), explains the move with a comment, and closes the original issue to keep the tracker clean. This keeps the issue tracker focused on real bugs and planned features, avoids clutter, enables clear prioritization, and maintains a clean backlog.