**Tool prompts**: Use strong models, keep ≤5 tools with simple parameters, use meaningful names, add `.describe()` hints, document tool outputs, include JSON examples.

**Schemas**: Use `z.string().date().transform()` for dates; use `.nullable()` instead of `.optional()` for strict validation; set `temperature: 0` for deterministic tool calls.

**Debugging**: Check `result.warnings` for provider support; inspect `result.request.body` for raw HTTP payloads.