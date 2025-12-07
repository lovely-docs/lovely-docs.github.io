## AI_UnsupportedModelVersionError
Occurs when upgrading to AI SDK 5 without updating provider packages to v2-compatible versions.

**Solution:** Update packages to:
- `ai@5.0.0+`
- `@ai-sdk/*@2.0.0+` (openai, anthropic, google, etc.)
- `@ai-sdk/provider@2.0.0+`
- `zod@4.1.8+`

Verify third-party providers support AI SDK 5 by checking their `@ai-sdk/provider` peer dependency version.