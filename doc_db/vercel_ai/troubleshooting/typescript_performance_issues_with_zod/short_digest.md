**Issue:** TypeScript crashes/hangs with AI SDK 5 + Zod due to complex type inference.

**Solutions:**
1. Upgrade Zod to 4.1.8+: `pnpm add zod@^4.1.8`
2. Or set `moduleResolution: "nodenext"` in `tsconfig.json`