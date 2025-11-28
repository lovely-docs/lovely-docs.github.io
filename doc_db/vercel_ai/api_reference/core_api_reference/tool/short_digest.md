Helper function for defining tools with TypeScript type inference. Connects `inputSchema` to `execute` method so argument types are properly inferred.

```ts
import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});
```

Key parameters: `description`, `inputSchema` (required), `execute`, `outputSchema`, `toModelOutput`, streaming callbacks (`onInputStart`, `onInputDelta`, `onInputAvailable`), `providerOptions`, and provider-defined tool properties (`type`, `id`, `name`, `args`).