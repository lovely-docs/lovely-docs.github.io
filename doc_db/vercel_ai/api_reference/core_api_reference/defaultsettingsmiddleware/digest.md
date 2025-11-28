## defaultSettingsMiddleware

A middleware function that applies default settings to language model calls, enabling consistent default parameters across multiple model invocations.

### Import
```ts
import { defaultSettingsMiddleware } from 'ai';
```

### API Signature

**Parameters:**
- `settings`: An object containing default parameter values to apply to language model calls. Accepts any valid `LanguageModelV3CallOptions` properties and optional provider metadata.

**Returns:** A middleware object that merges default settings with call-specific parameters, ensuring explicitly provided parameters take precedence over defaults and merges provider metadata objects.

### Usage

Create a model with default settings:
```ts
import { streamText, wrapLanguageModel, defaultSettingsMiddleware } from 'ai';

const modelWithDefaults = wrapLanguageModel({
  model: gateway('anthropic/claude-sonnet-4.5'),
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.7,
      maxOutputTokens: 1000,
      providerOptions: {
        openai: {
          reasoningEffort: 'high',
        },
      },
    },
  }),
});

// Use the model - default settings will be applied
const result = await streamText({
  model: modelWithDefaults,
  prompt: 'Your prompt here',
  temperature: 0.8, // Overrides the default 0.7
});
```

### How It Works

1. Takes a set of default settings as configuration
2. Merges these defaults with the parameters provided in each model call
3. Ensures explicitly provided parameters take precedence over defaults
4. Merges provider metadata objects from both sources