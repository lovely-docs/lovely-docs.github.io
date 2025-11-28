When using AI SDK RSC with Jest for testing RSC components, the module '@ai-sdk/rsc' may not be found. This occurs because Jest's default module resolution doesn't properly locate the package.

**Solution:** Configure Jest's module resolution by adding a `moduleNameMapper` entry in `jest.config.js`:

```json
"moduleNameMapper": {
  "^@ai-sdk/rsc$": "<rootDir>/node_modules/@ai-sdk/rsc/dist"
}
```

This maps the '@ai-sdk/rsc' module import to the actual distribution file location, allowing Jest to resolve the module correctly during test execution.