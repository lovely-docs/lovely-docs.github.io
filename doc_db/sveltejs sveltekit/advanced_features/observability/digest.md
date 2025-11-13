SvelteKit can emit OpenTelemetry spans for server-side operations: `handle` hooks, server `load` functions, form actions, and remote functions. This requires enabling experimental flags in `svelte.config.js`:

```js
kit: {
  experimental: {
    tracing: { server: true },
    instrumentation: { server: true }
  }
}
```

Instrumentation code goes in `src/instrumentation.server.ts`, which runs before application code. Access the root and current spans via `event.tracing.root` and `event.tracing.current` to add custom attributes:

```js
import { getRequestEvent } from '$app/server';
const event = getRequestEvent();
event.tracing.root.setAttribute('userId', user.id);
```

For local development with Jaeger, install dependencies and create `src/instrumentation.server.js`:

```js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { createAddHookMessageChannel } from 'import-in-the-middle';
import { register } from 'node:module';

const { registerOptions } = createAddHookMessageChannel();
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);

const sdk = new NodeSDK({
  serviceName: 'test-sveltekit-tracing',
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
```

Note: tracing has nontrivial overhead; consider enabling only in development/preview. `@opentelemetry/api` is an optional peer dependency.