## init

Initialize a new project with dependencies, the `cn` util, and CSS variables.

```bash
npx shadcn-svelte@latest init
```

Prompts for configuration:
- Base color (slate, gray, zinc, neutral, stone)
- Global CSS file path
- Import aliases for lib, components, utils, hooks, ui

Options: `-c/--cwd <path>`, `-o/--overwrite`, `--no-deps`, `--base-color <name>`, `--css <path>`, `--components-alias <path>`, `--lib-alias <path>`, `--utils-alias <path>`, `--hooks-alias <path>`, `--ui-alias <path>`, `--proxy <proxy>`

## add

Add components and dependencies to your project.

```bash
npx shadcn-svelte@latest add <component> -y -o
```

- `-y`: skip confirmation prompt
- `-o`: overwrite existing files

Presents interactive list of available components (accordion, alert, alert-dialog, aspect-ratio, avatar, badge, button, card, checkbox, collapsible, etc.)

Options: `-c/--cwd <path>`, `--no-deps`, `-a/--all` (install all components), `-y/--yes`, `-o/--overwrite`, `--proxy <proxy>`

## registry build

Generate registry JSON files from a `registry.json` source file.

```bash
npx shadcn-svelte@latest registry build [registry.json]
```

Outputs to `static/r` directory by default.

Options: `-c/--cwd <path>`, `-o/--output <path>` (destination directory), `-h/--help`

## Proxy

Use HTTP proxy for registry requests via `HTTP_PROXY` or `http_proxy` environment variables:

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```