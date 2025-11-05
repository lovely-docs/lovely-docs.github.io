## Observability with OpenTelemetry

SvelteKit can emit server-side OpenTelemetry spans for:
- `handle` hooks and functions in `sequence`
- Server and universal `load` functions
- Form actions
- Remote functions

### Setup

Enable experimental features in `svelte.config.js`:
```js
const config = {
	kit: {
		experimental: {
			tracing: { server: true },
			instrumentation: { server: true }
		}
	}
};
```

Create `src/instrumentation.server.ts` for tracing setup and instrumentation code. This file runs before application code is imported.

### Augmenting Spans

Access the root span and current span via `event.tracing`:
```js
import { getRequestEvent } from '$app/server';

const event = getRequestEvent();
event.tracing.root.setAttribute('userId', user.id);
```

The root span is associated with the root `handle` function. The current span depends on context (handle, load, form action, or remote function).

### Local Development with Jaeger

1. Install dependencies: `npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto import-in-the-middle`
2. Create `src/instrumentation.server.js`:
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

3. View traces at localhost:16686

### Dependencies

SvelteKit uses `@opentelemetry/api` as an optional peer dependency. If you see a missing dependency error, install `@opentelemetry/api` directly or use a library like `@opentelemetry/sdk-node` or `@vercel/otel` which depend on it.

**Note:** Tracing has nontrivial overhead. Consider enabling only in development and preview environments.