## registry-item.json Schema

JSON schema for defining custom registry items.

**Core properties**: `$schema`, `name`, `title`, `type`, `description`

**Item types**: `registry:block`, `registry:component`, `registry:lib`, `registry:hook`, `registry:ui`, `registry:page`, `registry:file`, `registry:style`, `registry:theme`

**Dependencies**: `dependencies` (npm packages), `registryDependencies` (other registry items via name, URL, local alias, or relative path)

**Files**: Array with `path`, `type`, and optional `target` (required for pages/files). Use `~` for project root.

**Styling**: `cssVars` (organized by theme/light/dark), `css` (add @layer/@utility/@keyframes rules)

**Metadata**: `author`, `docs` (installation message), `categories`, `meta` (custom key/value pairs)