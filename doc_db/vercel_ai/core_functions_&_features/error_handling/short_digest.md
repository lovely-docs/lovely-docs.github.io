## Error Handling Patterns
- **Regular errors**: Use try/catch with generateText and streamText
- **Simple stream errors**: Thrown as regular errors, caught with try/catch
- **Full stream errors**: Handle error/tool-error/abort parts in switch statement within stream loop, plus outer try/catch
- **Stream aborts**: Use `onAbort` callback (called on abort, not on normal completion) or check `part.type === 'abort'` in fullStream iteration. `onAbort` receives `steps` array of completed steps.