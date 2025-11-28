## Error Handling

**UI Errors:** Use `streamableUI.error()` to catch errors during UI generation, and wrap client components with React Error Boundary.

```tsx
ui.error(<div>Error: {e.message}</div>);
```

**Other Streaming Errors:** Return error objects from try-catch blocks for non-UI streams.

```tsx
try {
  streamableData.done(await fetchData());
  return { data: streamableData.value };
} catch (e) {
  return { error: e.message };
}
```