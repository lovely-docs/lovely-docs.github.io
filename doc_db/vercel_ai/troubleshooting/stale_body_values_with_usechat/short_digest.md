## Problem
Hook-level `body` configuration in `useChat` is captured once at initialization and doesn't update when component state changes.

## Solution
Pass dynamic values via the second argument of `sendMessage`:
```tsx
sendMessage(
  { text: input },
  {
    body: {
      temperature, // Current value
      userId, // Current value
    },
  },
);
```

## Alternative
Use `useRef` with a function at hook level:
```tsx
const temperatureRef = useRef(0.7);
body: () => ({ temperature: temperatureRef.current })
```

Request-level configuration is recommended for component state.