## prerender
`export const prerender = true/false/'auto'` generates static HTML at build time. Specify dynamic routes via `entries()` function. Pages must return identical content for all users.

## ssr
`export const ssr = false` skips server rendering, sends empty shell. Setting in root layout makes entire app client-only (SPA).

## csr
`export const csr = false` disables client-side rendering—no JavaScript shipped, HTML/CSS only, full-page navigation.

## trailingSlash
`export const trailingSlash = 'never' | 'always' | 'ignore'` controls URL trailing slash behavior.

## config
`export const config = { ... }` sets adapter-specific configuration, merged at top level only.