**Error**: `Type 'SomeModel' is not assignable to type 'LanguageModelV1'` (or `EmbeddingModelV3`) after SDK update.

**Cause**: Model specification changes create version mismatches between SDK and provider packages.

**Fix**: Update both the AI SDK and provider packages to latest versions.