## Version Format
Version numbers follow `MAJOR.MINOR.PATCH`:
- **Major**: Breaking API updates requiring code changes
- **Minor**: New features and improvements in public releases
- **Patch**: New features and bug fixes

## API Stability Levels

**Stable APIs**: All APIs without special prefixes are production-ready with backward compatibility maintained. Breaking changes only occur in major releases.

**Experimental APIs**: Prefixed with `experimental_` or `Experimental_` (e.g., `experimental_generateImage()`). These can change in any release. Usage guidelines:
- Test only in development, not production
- Review release notes before upgrading
- Prepare for potential code updates
- Pin exact version numbers (avoid `^` or `~` ranges) to prevent unexpected breaking changes

**Deprecated APIs**: Marked as `deprecated` and removed in future major releases. Migration path:
- Switch to recommended alternative API
- Follow migration guides released with major versions
- Automated codemods provided where possible to assist migration