When testing RSC components with Jest, configure moduleNameMapper in jest.config.js to resolve '@ai-sdk/rsc':

```json
"moduleNameMapper": {
  "^@ai-sdk/rsc$": "<rootDir>/node_modules/@ai-sdk/rsc/dist"
}
```