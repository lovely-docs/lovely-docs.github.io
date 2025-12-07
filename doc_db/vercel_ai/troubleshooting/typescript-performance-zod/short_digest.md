**Problem:** AI SDK 5 + Zod causes TypeScript crashes, slow type checking, and "excessively deep" type errors.

**Solutions:**
1. Upgrade Zod to 4.1.8+: `pnpm add zod@^4.1.8`
2. Or set `"moduleResolution": "nodenext"` in `tsconfig.json`