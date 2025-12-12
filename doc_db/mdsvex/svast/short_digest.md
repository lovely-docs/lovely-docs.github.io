# SVAST - Svelte Abstract Syntax Tree

Unist-based AST with camelCased nodes prefixed with `svelte`.

## Core Nodes

**Base**: UnistNode (type, data, position), UnistPosition (start/end points), UnistPoint (line/column/offset), UnistParent (children)

**Containers**: Root, Parent (elements/components/text/blocks), BaseTag (tagName, properties, selfClosing)

**Tags**: Element, Component, SvelteTag (`<svelte:self />`), Script, Style

**Properties**: Property (HTML attributes, shorthand: `{prop}` or `prop`), Directive (x:y={z}, name + specifier + modifiers)

**Content**: Text, Comment, Expression

**Blocks**: VoidBlock (`{@html}`), BranchingBlock (if/await/custom), EachBlock (with itemName/itemIndex/itemKey), Branch

Example combining properties and directives:
```js
<input on:click|preventDefault={handleClick} class:active={isActive} />
// → svelteElement with svelteDirective nodes (name, specifier, modifiers, value)
```

Example each block:
```js
{#each items as item, i (item.id)}
  <div>{item.name}</div>
{/each}
// → svelteEachBlock with itemName, itemIndex, itemKey, children
```