When testing RSC components with Jest, configure module resolution in `jest.config.js`:

```json
"moduleNameMapper": {
  "^@ai-sdk/rsc$": "<rootDir>/node_modules/@ai-sdk/rsc/dist"
}
```