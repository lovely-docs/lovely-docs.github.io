## Overview
SvelteKit can emit server-side OpenTelemetry spans for observability. Available since version 2.31. Experimental feature requiring opt-in via `kit.experimental.tracing.server` and `kit.experimental.instrumentation.server` in `svelte.config.js`.

## What Gets Traced
- `handle` hook and `handle` functions in `sequence` (shown as parent-child relationships)
- Server and universal `load` functions (when run on server)
- Form actions
- Remote functions

## Setup
Create `src/instrumentation.server.ts` for tracing setup. This file runs before application code is imported.

Enable in config:
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

## Augmenting Spans
Access `root` span and `current` span via `event.tracing`. Add custom attributes:
```js
import { getRequestEvent } from '$app/server';
const event = getRequestEvent();
event.tracing.root.setAttribute('userId', user.id);
```

## Development Quickstart with Jaeger
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

## Dependencies
`@opentelemetry/api` is an optional peer dependency. Usually satisfied by `@opentelemetry/sdk-node` or similar. Install manually if needed.

## Performance Note
Tracing and instrumentation have non-trivial overhead. Consider enabling only in development/preview environments.