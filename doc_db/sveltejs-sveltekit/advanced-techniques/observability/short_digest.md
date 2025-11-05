## Observability with OpenTelemetry

Enable in `svelte.config.js`:
```js
kit: {
	experimental: {
		tracing: { server: true },
		instrumentation: { server: true }
	}
}
```

SvelteKit emits spans for `handle` hooks, `load` functions, form actions, and remote functions. Create `src/instrumentation.server.ts` for tracing setup.

Access spans via `event.tracing.root` and `event.tracing.current` to add custom attributes.

For local development with Jaeger, install `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/exporter-trace-otlp-proto`, and `import-in-the-middle`, then configure the NodeSDK in `src/instrumentation.server.js` to export traces to localhost:16686.