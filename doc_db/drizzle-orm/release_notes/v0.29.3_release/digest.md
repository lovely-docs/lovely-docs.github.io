## v0.29.3 Release

**Fix:** Expo peer dependencies are now optional.

This release addresses an issue where Expo peer dependencies were required, which could cause problems for users not using Expo. The fix makes these dependencies optional, allowing developers to use DrizzleORM with Expo SQLite without unnecessary dependency constraints.

Related: Expo documentation and Expo SQLite integration guide.