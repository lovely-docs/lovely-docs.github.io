## Custom Providers

Create custom providers using `customProvider()` to pre-configure model settings, provide aliases, and limit available models.

**Override default settings and create aliases:**
```ts
export const openai = customProvider({
  languageModels: {
    'gpt-5.1': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: { reasoningEffort: 'high' }
          }
        }
      })
    }),
    'gpt-5.1-high-reasoning': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: { reasoningEffort: 'high' }
          }
        }
      })
    })
  },
  fallbackProvider: gateway
});
```

**Create model name aliases for easy version updates:**
```ts
export const anthropic = customProvider({
  languageModels: {
    opus: gateway('anthropic/claude-opus-4.1'),
    sonnet: gateway('anthropic/claude-sonnet-4.5'),
    haiku: gateway('anthropic/claude-haiku-4.5')
  },
  fallbackProvider: gateway
});
```

**Limit available models across multiple providers:**
```ts
export const myProvider = customProvider({
  languageModels: {
    'text-medium': gateway('anthropic/claude-3-5-sonnet-20240620'),
    'text-small': gateway('openai/gpt-5-mini'),
    'reasoning-medium': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: { reasoningEffort: 'high' }
          }
        }
      })
    }),
    'reasoning-fast': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: { reasoningEffort: 'low' }
          }
        }
      })
    })
  },
  embeddingModels: {
    embedding: gateway.embeddingModel('openai/text-embedding-3-small')
  }
});
```

## Provider Registry

Create a provider registry using `createProviderRegistry()` to manage multiple providers and access them through simple string IDs with format `providerId:modelId`.

**Basic setup:**
```ts
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { createProviderRegistry, gateway } from 'ai';

export const registry = createProviderRegistry({
  gateway,
  anthropic,
  openai
});
```

**Custom separator (default is `:`)**:
```ts
export const customSeparatorRegistry = createProviderRegistry(
  {
    gateway,
    anthropic,
    openai
  },
  { separator: ' > ' }
);
```

**Access language models:**
```ts
const { text } = await generateText({
  model: registry.languageModel('openai:gpt-5.1'),
  prompt: 'Invent a new holiday and describe its traditions.'
});
```

**Access embedding models:**
```ts
const { embedding } = await embed({
  model: registry.embeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach'
});
```

**Access image models:**
```ts
const { image } = await generateImage({
  model: registry.imageModel('openai:dall-e-3'),
  prompt: 'A beautiful sunset over a calm ocean'
});
```

## Combined Example

Comprehensive setup combining custom providers, registry, and middleware:

```ts
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { xai } from '@ai-sdk/xai';
import { groq } from '@ai-sdk/groq';
import {
  createProviderRegistry,
  customProvider,
  defaultSettingsMiddleware,
  gateway,
  wrapLanguageModel
} from 'ai';

export const registry = createProviderRegistry(
  {
    gateway,
    xai,
    custom: createOpenAICompatible({
      name: 'provider-name',
      apiKey: process.env.CUSTOM_API_KEY,
      baseURL: 'https://api.custom.com/v1'
    }),
    anthropic: customProvider({
      languageModels: {
        fast: anthropic('claude-haiku-4-5'),
        writing: anthropic('claude-sonnet-4-5'),
        reasoning: wrapLanguageModel({
          model: anthropic('claude-sonnet-4-5'),
          middleware: defaultSettingsMiddleware({
            settings: {
              maxOutputTokens: 100000,
              providerOptions: {
                anthropic: {
                  thinking: {
                    type: 'enabled',
                    budgetTokens: 32000
                  }
                } satisfies AnthropicProviderOptions
              }
            }
          })
        })
      },
      fallbackProvider: anthropic
    }),
    groq: customProvider({
      languageModels: {
        'gemma2-9b-it': groq('gemma2-9b-it'),
        'qwen-qwq-32b': groq('qwen-qwq-32b')
      }
    })
  },
  { separator: ' > ' }
);

const model = registry.languageModel('anthropic > reasoning');
```

## Global Provider Configuration

By default, the global provider is set to the Vercel AI Gateway. Use plain model ID strings without provider prefix:

```ts
const result = await streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.'
});
```

Customize the global provider during startup:

```ts
import { openai } from '@ai-sdk/openai';

globalThis.AI_SDK_DEFAULT_PROVIDER = openai;
```

Then use models without prefix:

```ts
const result = await streamText({
  model: 'gpt-5.1',
  prompt: 'Invent a new holiday and describe its traditions.'
});
```