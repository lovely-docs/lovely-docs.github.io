## init
```bash
npx shadcn-svelte@latest init
```
Initializes project with dependencies, `cn` util, and CSS variables. Configures base color and import aliases.

## add
```bash
npx shadcn-svelte@latest add button
```
Adds components interactively or by name.

## registry build
```bash
npx shadcn-svelte@latest registry build ./registry.json
```
Generates registry JSON files to `static/r`.

## Proxy
```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```
Respects HTTP_PROXY environment variable for requests.