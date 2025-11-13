## init

Initialize a new project with dependencies, the `cn` util, and CSS variables:

```bash
npx shadcn-svelte@latest init
```

Prompts for configuration:
- Base color (slate, gray, zinc, neutral, stone)
- Global CSS file path
- Import aliases for lib, components, utils, hooks, ui

Options: `--cwd`, `--overwrite`, `--no-deps`, `--base-color`, `--css`, `--components-alias`, `--lib-alias`, `--utils-alias`, `--hooks-alias`, `--ui-alias`, `--proxy`

## add

Add components and dependencies to your project:

```bash
npx shadcn-svelte@latest add button
```

Presents an interactive list of available components to select from. Options: `--cwd`, `--no-deps`, `--all`, `--yes`, `--overwrite`, `--proxy`

## registry build

Generate registry JSON files from a `registry.json` source:

```bash
npx shadcn-svelte@latest registry build ./registry.json
```

Outputs to `static/r` directory by default. Options: `--cwd`, `--output`

## Proxy Support

Set `HTTP_PROXY` or `http_proxy` environment variables to route requests through a proxy:

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```