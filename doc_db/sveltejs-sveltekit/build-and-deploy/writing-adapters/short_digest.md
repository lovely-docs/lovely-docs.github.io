## Adapter API

Export default function returning `Adapter` with required `name` and `adapt(builder)`, optional `emulate()` and `supports`.

## Adapt Method

Must clear build dir, write output via `builder.writeClient/Server/Prerendered()`, generate code that imports `Server`, instantiates with `builder.generateManifest()`, listens for requests, converts to `Request`, calls `server.respond(request, { getClientAddress })`, exposes platform via `platform` option, shims `fetch` if needed, bundles output, and places files correctly.