## Creating a Project

Start a new SvelteKit app with:
```sh
npx sv create my-app
cd my-app
npm run dev
```

The CLI scaffolds a new project and optionally sets up TypeScript and other tooling. See CLI docs for options and integrations page for additional tooling setup.

`npm run dev` starts the development server on localhost:5173 (install dependencies first if not done during creation).

### Core Concepts

- Each page is a Svelte component
- Create pages by adding files to `src/routes` directory
- Pages are server-rendered on first visit for speed, then client-side app takes over

### Editor Setup

Recommended: Visual Studio Code with the Svelte extension. Other editors also supported via sveltesociety.dev resources.