

## Pages

### changelog-conventions
Changelog entry format: `- <type>(<scope>): <description>` with types (fix/feat/improve/chore/docs), component or general scope, concise lowercase verb-first descriptions with backticks for code, 10-15 words max.

## Changelog Entry Format

All changelog entries follow this structure:
```
- <type>(<scope>): <description>
```

### Type Categories
- `fix`: Resolves a bug or issue
- `feat`: Adds a new feature or enhancement (Minor or Major release)
- `improve`: Enhances existing functionality without fixing a bug
- `chore`: Internal refactors, cleanups, or tooling changes with no user-facing impact
- `docs`: Changes to documentation in the codebase (JSdoc comments); documentation site changes don't require entries

### Scope
- Use component name (e.g., `Select`, `Tooltip`, `Calendar`) for component-specific changes
- Use general terms (e.g., `all`, `SSR`) for multi-component or cross-cutting changes
- Omit scope only for truly global changes (rare)

### Description Guidelines
- Concise, lowercase phrase or sentence (no period)
- Start with a verb where possible (fix, add, ensure, expose)
- Use backticks for inline code: prop names, types, values (e.g., `disableOutsideDays`)
- Be specific; avoid vague terms unless clarified
- Target 10-15 words max

### Examples
```
fix(Select.Trigger): improve accessibility for screen readers and keyboard navigation

chore(Menubar.Content): simplify internal implementation for maintainability
fix(Menubar): prevent multiple submenus from opening simultaneously when too close

fix(Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true`
fix(Range Calendar): prevent outside days from being focusable when `disableOutsideDays` is `true`
fix(Calendar): ensure default placeholder isn't a disabled date for keyboard navigation
```

### tracking-bugs-and-feature-requests
Use Issues for confirmed bugs and accepted feature requests; use Discussions for proposing features, design discussions, and questions; feature requests must start as discussions and only become issues after acceptance and refinement.

## Issues vs Discussions Policy

**Issues** are for:
- Reproducible bugs with clear steps to reproduce, error messages, screenshots, and expected vs actual behavior
- Confirmed problems relating to existing functionality
- Accepted feature requests that have been discussed, refined, and approved for implementation

**Discussions** are for:
- Feature requests (starting point before implementation)
- Design discussions before code is written
- Questions and support from community
- Brainstorming and exploring alternatives
- RFCs (Request for Comments) for structured feedback

**Feature Request Workflow:**
1. Start a Discussion describing the feature, benefits, and potential challenges
2. Gather feedback and refine the idea based on community input
3. Refine and finalize - if consensus is reached and deemed valuable, maintainer determines next steps
4. Issue Creation - once accepted for implementation, a maintainer or contributor creates an issue to track progress

**If a feature request is opened as an Issue:**
- Maintainer converts it to a Discussion (if not yet accepted)
- Explains the move with a comment linking to this policy
- Closes the original issue to keep tracker clean

This approach keeps the issue tracker focused on real bugs and planned features, avoids clutter, enables clear prioritization, and maintains a clean backlog for better project health.

