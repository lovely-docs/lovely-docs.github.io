## Purpose
`drizzle-kit check` validates SQL migrations history consistency, useful for team development across branches.

## Usage
```shell
npx drizzle-kit check --dialect=postgresql
npx drizzle-kit check --dialect=postgresql --out=./migrations-folder
npx drizzle-kit check --config=drizzle-dev.config.ts
```

## Configuration
Via `drizzle.config.ts`:
```ts
export default defineConfig({
  dialect: "postgresql",
});
```

Or CLI options: `--dialect` (required), `--out` (default: `./drizzle`), `--config` (default: `drizzle.config.ts`)