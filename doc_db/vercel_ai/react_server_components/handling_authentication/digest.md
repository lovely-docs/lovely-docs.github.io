## Authentication in RSC

AI SDK RSC uses Server Actions to power streaming values and UI from the server. Server Actions are exposed as public, unprotected endpoints, so you must treat them as public-facing API endpoints and verify user authorization before returning data.

### Implementation Pattern

Retrieve the authentication token from cookies, validate it, and return an error response if authentication fails:

```tsx
'use server';

import { cookies } from 'next/headers';
import { createStreamableUI } from '@ai-sdk/rsc';
import { validateToken } from '../utils/auth';

export const getWeather = async () => {
  const token = cookies().get('token');

  if (!token || !validateToken(token)) {
    return {
      error: 'This action requires authentication',
    };
  }
  
  const streamableDisplay = createStreamableUI(null);
  streamableDisplay.update(<Skeleton />);
  streamableDisplay.done(<Weather />);

  return {
    display: streamableDisplay.value,
  };
};
```

The pattern is: extract token from cookies, validate it using your auth utility, return error object if invalid, otherwise proceed with the Server Action logic.

**Note:** AI SDK RSC is experimental; use AI SDK UI for production.