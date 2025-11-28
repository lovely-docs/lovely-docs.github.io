## Problem
Streaming responses work locally but get cut off when deployed to Vercel, with timeouts or "Connection closed" errors appearing in logs.

## Root Cause
Vercel's Fluid Compute has a default function duration limit of 5 minutes (300 seconds) across all plans. Longer streaming responses exceed this limit.

## Solution
Increase the `maxDuration` setting to extend the timeout.

### Next.js (App Router)
Add to your route file or Server Action page:
```tsx
export const maxDuration = 600;
```

### Other Frameworks
Configure in `vercel.json`:
```json
{
  "functions": {
    "api/chat/route.ts": {
      "maxDuration": 600
    }
  }
}
```

## Duration Limits by Plan
- **Hobby**: Up to 300 seconds (5 minutes)
- **Pro**: Up to 800 seconds (~13 minutes)
- **Enterprise**: Up to 800 seconds (~13 minutes)

Note: Setting `maxDuration` above 300 seconds requires Pro or Enterprise plan.