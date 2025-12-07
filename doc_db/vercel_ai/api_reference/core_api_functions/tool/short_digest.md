Helper function for TypeScript type inference in tool definitions. Connects `inputSchema` to `execute` method so input types are automatically inferred.

```ts
import { tool } from 'ai';
import { z } from 'zod';

const weatherTool = tool({
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

Key parameters: **inputSchema** (required, Zod/JSON Schema), **execute** (optional, async function receiving typed input and ToolCallOptions), **description**, **outputSchema**, **toModelOutput**, streaming callbacks (**onInputStart**, **onInputDelta**, **onInputAvailable**), and provider-specific options (**type**, **id**, **name**, **args**, **providerOptions**).