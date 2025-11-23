## init
```bash
npx shadcn-svelte@latest init
```
Initializes project with dependencies, `cn` utility, CSS variables. Prompts for base color, CSS file path, and import aliases. Options: `--base-color`, `--css`, `--*-alias`, `--no-deps`, `-o/--overwrite`, `--proxy`

## add
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Adds components to project. `-y` skips confirmation, `-o` overwrites files. Options: `-a/--all`, `--no-deps`, `--proxy`

## registry build
```bash
npx shadcn-svelte@latest registry build [registry.json]
```
Generates registry JSON files to `static/r` directory. Options: `-o/--output`

## Proxy
```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```
Use HTTP proxy for registry requests via environment variables.