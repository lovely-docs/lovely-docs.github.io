## Issue
When using AI SDK 5 with Zod, TypeScript may crash, hang, or become unresponsive with errors like "Type instantiation is excessively deep and possibly infinite" due to slow type checking in files importing AI SDK functions.

## Root Cause
AI SDK 5 has specific compatibility requirements with Zod versions. Standard Zod imports (`import { z } from 'zod'`) can cause TypeScript's type inference to become excessively complex. Different module resolution settings cause TypeScript to load the same Zod declarations twice, leading to expensive structural comparisons.

## Solutions

**Primary: Upgrade Zod to 4.1.8 or later**
```bash
pnpm add zod@^4.1.8
```
This version includes a fix for the module resolution issue.

**Alternative: Update TypeScript configuration**
If upgrading Zod isn't possible, update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "moduleResolution": "nodenext"
  }
}
```
This resolves performance issues while keeping standard Zod imports.