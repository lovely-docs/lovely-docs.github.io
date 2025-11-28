## Migration Process

1. Backup your project and ensure all changes are committed to version control
2. Upgrade to AI SDK 6.0 Beta
3. Follow the breaking changes guide
4. Verify the project works as expected
5. Commit your changes

## Package Versions to Update

Update these packages in `package.json` to beta versions:
- `ai`: `6.0.0-beta` (or `@beta` dist-tag)
- `@ai-sdk/provider`: `3.0.0-beta` (or `@beta` dist-tag)
- `@ai-sdk/provider-utils`: `4.0.0-beta` (or `@beta` dist-tag)
- `@ai-sdk/*`: `3.0.0-beta` (or `@beta` dist-tag for other packages)

Example upgrade command:
```
pnpm install ai@beta @ai-sdk/react@beta @ai-sdk/openai@beta
```

## Codemods

AI SDK 6.0 Beta will provide Codemod transformations to automatically upgrade your codebase when features are deprecated, removed, or changed. Codemods run automatically on your codebase to apply many changes without manual file-by-file updates. However, codemods may not cover all necessary changes - you may need to make additional manual updates.

Note: The codemod table in the documentation is currently incomplete (marked as TBD).

## Important Notes

- AI SDK 6 is in beta and introduces new capabilities like agents and tool approval
- Consider waiting for the stable release before upgrading production projects
- Refer to the AI SDK 6 Beta announcement for details on new features