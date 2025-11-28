## Problem
Inline `"use server"` annotated Server Actions cannot be defined directly in Client Components.

## Solutions
Three approaches to use Server Actions in Client Components:

1. **Export from separate file**: Create a dedicated file with `"use server"` at the top level, then import and use the exported functions in your Client Component.

2. **Pass through props**: Define Server Actions in a Server Component and pass them down as props to Client Components.

3. **Use createAI and useActions hooks**: Implement a combination of the `createAI` and `useActions` hooks from the AI SDK to access Server Actions.

## Example
```ts
// actions.ts
'use server';

import { generateText } from 'ai';

export async function getAnswer(question: string) {
  'use server';

  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: question,
  });

  return { answer: text };
}
```

This file can then be imported and used in Client Components. The `"use server"` directive at the file level marks all exports as Server Actions.