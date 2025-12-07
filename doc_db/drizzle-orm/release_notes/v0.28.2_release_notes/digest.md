## v0.28.2 Release

### Community Contributions
This release includes contributions from the community.

### Internal Changes
- Added comprehensive test suite for d1
- Fixed documentation issues

### Bug Fixes
- **MySQL timestamp milliseconds**: Fixed truncation issue where milliseconds were being lost in timestamp values
- **SQLite `.get()` method**: Corrected type signature for sqlite-based dialects (issue #565)
- **SQLite proxy**: Fixed bug causing queries to execute twice

### New Features
- **Typebox support**: Added official support for Typebox package integration via new `drizzle-typebox` package
  - Enables type-safe schema validation using Typebox
  - See `/docs/typebox` for usage examples and documentation