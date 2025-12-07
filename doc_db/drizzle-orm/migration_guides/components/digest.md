## Overview
This page documents the MDX components available for use in the Drizzle ORM documentation. It serves as a reference for how to structure and display various types of content.

## Components

**Npm** - Display npm package installation commands
```
<Npm>drizzle-orm</Npm>
<Npm>drizzle-orm -D drizzle-kit</Npm>
```

**AnchorCards** - Navigation cards linking to page anchors
```
<AnchorCards cards={{ Anchor1: "#anchor1", Anchor2: "#anchor2" }} />
```

**Callout** - Highlighted callout boxes with optional emoji and types (info, warning, error)
```
<Callout emoji={"😀"}>Callout example</Callout>
<Callout type={"warning"}>Callout example</Callout>
```

**CodeTabs/CodeTab** - Tabbed code blocks with syntax highlighting and copy functionality
```
<CodeTabs items={["index.ts", "schema.ts"]}>
  <CodeTab>
    ```typescript copy /schema/3
    import * as schema from './schema';
    const db = drizzle(client, { schema });
    ```
  </CodeTab>
  ```typescript
  export const users = pgTable('users', { ... });
  ```
</CodeTabs>
```

**IsSupportedChipGroup** - Display database support status
```
<IsSupportedChipGroup chips={{ PostgreSQL: true, SQLite: true, MySQL: false }} />
```

**Section** - Container for related code blocks (TypeScript + SQL pairs)
```
<Section>
  ```typescript
  const table = sqliteTable('table', { int1: integer('int1').default(42) });
  ```
  ```sql
  CREATE TABLE `table` (`int1` integer DEFAULT 42);
  ```
</Section>
```

**Tabs/Tab** - Multi-tab content for database-specific examples
```
<Tabs items={['PostgreSQL', 'MySQL', 'SQLite']}>
  <Tab><Section>...</Section></Tab>
  <Tab><Section>...</Section></Tab>
</Tabs>
```

**SimpleLinkCards** - Card links to related documentation pages
```
<SimpleLinkCards cards={{
  "PostgreSQL column types": "/docs/column-types/pg",
  "MySQL column types": "/docs/column-types/mysql"
}} />
```

**Steps** - Numbered step-by-step instructions with h4 headers
```
<Steps>
  #### Install babel plugin
  ```shell
  npm install babel-plugin-inline-import
  ```
  #### Update config files
  ...
</Steps>
```

**YoutubeCards** - Embedded YouTube video cards with metadata
```
<YoutubeCards cards={[
  { id: "4ZhtoOFKFP8", title: "...", description: "...", time: '38:08' }
]} />
```

**Collapsable code block** - Code blocks with collapsible content
```
```prisma copy filename="..." collapsable
...
```
```