## Setup

```bash
npx sv create myapp
npm install
npm run dev
```

## Component Files

`.svelte` files contain `<script>`, `<style>`, and markup sections. `<script module>` runs once at load; `<script>` runs per instance. Styles auto-scope.

## Reactive Logic

`.svelte.js/.ts` files support runes for reusable reactive logic and shared state.