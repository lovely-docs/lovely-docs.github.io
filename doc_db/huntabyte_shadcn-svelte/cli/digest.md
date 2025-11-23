## init

Initialize a new project with dependencies, the `cn` utility, and CSS variables.

```bash
npx shadcn-svelte@latest init
```

Prompts for configuration:
- Base color (slate, gray, zinc, neutral, stone)
- Global CSS file path
- Import aliases for lib, components, utils, hooks, ui

Options: `-c/--cwd` (working directory), `-o/--overwrite` (overwrite files), `--no-deps` (skip dependency installation), `--base-color`, `--css`, `--components-alias`, `--lib-alias`, `--utils-alias`, `--hooks-alias`, `--ui-alias`, `--proxy`

## add

Add components and dependencies to your project.

```bash
npx shadcn-svelte@latest add <component> -y -o
```

- `-y`: skip confirmation prompt
- `-o`: overwrite existing files

Presents interactive list of available components (accordion, alert, alert-dialog, aspect-ratio, avatar, badge, button, card, checkbox, collapsible, etc.)

Options: `-c/--cwd` (working directory), `--no-deps` (skip package dependencies), `-a/--all` (install all components), `-y/--yes` (skip confirmation), `-o/--overwrite` (overwrite files), `--proxy`

## registry build

Generate registry JSON files from a `registry.json` source file.

```bash
npx shadcn-svelte@latest registry build [registry.json]
```

Outputs to `static/r` directory by default.

Options: `-c/--cwd` (working directory), `-o/--output` (destination directory)

## Proxy

Use HTTP proxy for registry requests via `HTTP_PROXY` or `http_proxy` environment variables:

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```