Server Actions in RSC are public endpoints, so validate user authorization before returning data. Extract token from cookies, validate it, and return error if invalid:

```tsx
'use server';
const token = cookies().get('token');
if (!token || !validateToken(token)) {
  return { error: 'This action requires authentication' };
}
// proceed with action
```