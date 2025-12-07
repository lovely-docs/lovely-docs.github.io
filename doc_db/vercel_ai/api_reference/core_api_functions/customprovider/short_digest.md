Maps model IDs to custom model instances with optional fallback provider. Supports language models, embedding models, and image models. Returns a Provider with methods to retrieve models by ID.

Example: wrap OpenAI models with custom settings and aliases using `customProvider({ languageModels: { 'gpt-4': wrapLanguageModel(...) }, fallbackProvider: openai })`