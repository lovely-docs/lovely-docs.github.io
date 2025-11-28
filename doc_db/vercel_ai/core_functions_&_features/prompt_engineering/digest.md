## Tips for Tool Prompts

When creating prompts with tools, follow these practices:

1. Use strong tool-calling models like `gpt-4.1` or `gpt-5`; weaker models struggle with tool calls
2. Keep tool count low (≤5) and parameter complexity minimal
3. Use semantically meaningful names for tools, parameters, and properties
4. Add `.describe("...")` to Zod schema properties to hint at their purpose
5. Document tool output in the `description` field when outputs are unclear or tools have dependencies
6. Include JSON example input/outputs of tool calls in prompts to demonstrate usage

## Tool & Structured Data Schemas

**Zod Dates**: Models return dates as strings, not Date objects. Use `z.string().datetime()` or `z.string().date()` with a transformer:

```ts
const result = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({
    events: z.array(
      z.object({
        event: z.string(),
        date: z.string().date().transform(value => new Date(value)),
      }),
    ),
  }),
  prompt: 'List 5 important events from the year 2000.',
});
```

**Optional Parameters**: For strict schema validation compatibility (especially OpenAI structured outputs), use `.nullable()` instead of `.optional()`:

```ts
// Fails with strict validation
const failingTool = tool({
  description: 'Execute a command',
  inputSchema: z.object({
    command: z.string(),
    workdir: z.string().optional(),
  }),
});

// Works with strict validation
const workingTool = tool({
  description: 'Execute a command',
  inputSchema: z.object({
    command: z.string(),
    workdir: z.string().nullable(),
  }),
});
```

**Temperature Settings**: Use `temperature: 0` for tool calls and object generation to ensure deterministic results:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  temperature: 0,
  tools: {
    myTool: tool({
      description: 'Execute a command',
      inputSchema: z.object({ command: z.string() }),
    }),
  },
  prompt: 'Execute the ls command',
});
```

Lower temperature reduces randomness, critical for structured data generation, precise tool calls, and strict schema compliance.

## Debugging

**Inspecting Warnings**: Check provider support for features via `result.warnings`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Hello, world!',
});
console.log(result.warnings);
```

**HTTP Request Bodies**: Inspect raw request payloads via `result.request.body`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Hello, world!',
});
console.log(result.request.body);
```