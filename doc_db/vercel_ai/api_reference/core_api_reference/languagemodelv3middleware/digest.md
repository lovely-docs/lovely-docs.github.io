## LanguageModelV3Middleware

Middleware interface for intercepting and modifying language model calls in a model-agnostic way. Enables adding features like guardrails, RAG, caching, and logging.

**Note:** This is an experimental feature.

### API Signature

The middleware provides three optional methods:

- **transformParams**: Intercepts and transforms call parameters before they reach the language model. Receives the operation type ("generate" or "stream") and LanguageModelV3CallOptions, returns modified LanguageModelV3CallOptions.

- **wrapGenerate**: Wraps the generate operation. Receives the doGenerate function, call parameters, and model instance. Returns DoGenerateResult.

- **wrapStream**: Wraps the stream operation. Receives the doStream function, call parameters, and model instance. Returns DoStreamResult.

### Import

```
import { LanguageModelV3Middleware } from "ai"
```