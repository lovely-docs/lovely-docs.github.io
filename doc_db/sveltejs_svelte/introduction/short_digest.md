## Setup

**SvelteKit:** `npx sv create myapp && npm run dev`

**Vite:** `npm create vite@latest && npm run build`

## Component Structure

`.svelte` files contain optional `<script>`, `<script module>`, markup, and `<style>` sections. Instance scripts run per component, module scripts run once. Styles are scoped to the component.

## Reactive Modules

`.svelte.js` and `.svelte.ts` files support runes for reactive logic and state sharing.