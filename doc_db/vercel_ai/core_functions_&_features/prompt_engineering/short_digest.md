**Tool Prompts**: Use strong models, keep tools ≤5, use meaningful names, add `.describe()` hints, document tool outputs, include JSON examples.

**Zod Dates**: Use `z.string().date().transform(value => new Date(value))` since models return date strings.

**Optional Parameters**: Use `.nullable()` instead of `.optional()` for strict schema validation compatibility.

**Temperature**: Set `temperature: 0` for tool calls and object generation for deterministic results.

**Debugging**: Check `result.warnings` for provider support and `result.request.body` for raw HTTP payloads.