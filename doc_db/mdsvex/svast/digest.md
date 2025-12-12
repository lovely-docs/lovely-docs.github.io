# SVAST - Svelte Abstract Syntax Tree

SVAST is an AST implementation following the Unist spec. All custom node types are camelCased and prefixed with `svelte`. The AST is language-agnostic with no opinion on expression contents.

## Base Unist Nodes

**UnistNode**: Base interface with `type: string`, `data: UnistData?`, `position: UnistPosition?`

**UnistPosition**: Represents node location with `start` and `end` UnistPoint, optional `indent`

**UnistPoint**: Represents a location with `line` (1-indexed), `column` (1-indexed), `offset` (0-indexed)

**UnistData**: Ecosystem-reserved space for node metadata

**UnistParent**: Node with `children: [UnistNode]`

## SVAST Nodes

**Parent**: Container with children including elements, components, comments, text, expressions, and blocks

**Literal**: Generic node with `type` and `value: string`

**Root**: Root node of the tree

**BaseTag**: Base for elements/components with `tagName`, `properties: [Property | Directive]`, `selfClosing: boolean`

**SvelteTag** (`type: "svelteMeta"`): Special svelte-namespaced tags like `<svelte:self />`
```js
<svelte:self this={Component} />
// →
{
  type: 'svelteTag',
  tagName: 'self',
  properties: [{
    type: 'svelteProperty',
    name: 'this',
    modifiers: [],
    value: [{ type: 'svelteExpression', value: 'Component' }]
  }],
  selfClosing: true,
  children: []
}
```

**Element** (`type: "svelteElement"`): DOM elements
```js
<input on:click|preventDefault={handleClick} />
// →
{
  type: 'svelteElement',
  tagName: 'input',
  properties: [{
    type: 'svelteDirective',
    name: 'on',
    specifier: 'click',
    modifiers: [{ type: 'modifier', value: 'preventDefault' }],
    value: [{ type: 'svelteExpression', value: 'handleClick' }]
  }],
  selfClosing: true,
  children: []
}
```

**Component** (`type: "svelteComponent"`): PascalCased component tags (same structure as Element)

**Script** (`type: "svelteScript"`): Script tags with single text child
```js
<script>console.log('boo');</script>
// →
{
  type: 'svelteScript',
  tagName: 'script',
  properties: [],
  selfClosing: false,
  children: [{ type: 'text', value: '\n  console.log(\'boo\');\n' }]
}
```

**Style** (`type: "svelteStyle"`): Style tags with single text child (same structure as Script)

**BaseProperty**: Base with `name`, `shorthand: 'none' | 'boolean' | 'expression'`, `value: [Text | Expression]`, `modifiers: [Literal]`

**Property** (`type: 'svelteProperty'`): HTML/SVG/ARIA/XML attributes. Shorthand syntax: `{prop}` (expression) or `prop` (boolean)
```js
<a name="hello {friend}!" />
// →
{
  type: 'svelteElement',
  tagName: 'a',
  properties: [{
    type: 'svelteProperty',
    name: 'name',
    value: [
      { type: 'text', value: 'hello' },
      { type: 'svelteExpression', value: 'friend' },
      { type: 'text', value: '!' }
    ],
    shorthand: 'none',
    modifiers: []
  }],
  selfClosing: true,
  children: []
}
```

**Directive** (`type: 'svelteDirective'`): Svelte directives `x:y={z}`. `name` is directive type (before `:`), `specifier` is implementation (after `:`). With shorthand, `value` is one Expression with value equal to specifier.
```js
<a class:myclass={x ? y : z} on:click|preventDefault={(e) => fn(e)} />
// →
{
  type: 'svelteElement',
  tagName: 'a',
  properties: [
    {
      type: 'svelteDirective',
      name: 'class',
      specifier: 'myclass',
      value: [{ type: 'svelteExpression', value: 'x ? y : z' }],
      shorthand: 'none',
      modifiers: []
    },
    {
      type: 'svelteDirective',
      name: 'on',
      specifier: 'click',
      value: [{ type: 'svelteExpression', value: '(e) => fn(e)' }],
      shorthand: 'none',
      modifiers: [{ type: 'svelteModifier', value: 'preventDefault' }]
    }
  ],
  selfClosing: true,
  children: []
}
```

**Comment** (`type: "comment"`): HTML comments with `value` containing comment text
```js
<!--Some thing here-->
// → { type: 'comment', value: 'Some thing here' }
```

**Text** (`type: "text"`): Bare text with `value`
```js
<div>Hello there</div>
// → { type: 'svelteElement', tagName: 'div', properties: [], selfClosing: false, children: [{ type: 'text', value: 'Hello there' }] }
```

**VoidBlock** (`type: 'svelteVoidBlock'`): Void blocks (no branches) with `name` and `expression: Expression`
```js
{@html `<p>something</p>`}
// →
{
  type: 'svelteVoidBlock',
  name: 'html',
  expression: { type: 'svelteExpression', value: '<p>something</p>' }
}
```

**BranchingBlock** (`type: 'svelteBranchingBlock'`): Blocks with arbitrary named branches. `name` is block name, `branches: [Branch]` (at least one)
```js
{#custom someExpression}Hello{/custom}
// →
{
  type: 'svelteBranchingBlock',
  name: 'custom',
  branches: [{
    type: 'svelteBranch',
    name: 'custom',
    expression: { type: 'svelteExpression', value: 'someExpression' },
    children: [{ type: 'text', value: 'Hello' }]
  }]
}
```

**EachBlock** (`type: 'svelteEachBlock'`): Each blocks with `expression` (collection), `itemName` (loop variable), optional `itemIndex`, optional `itemKey` (keyed each)
```js
{#each array.filter(v => v.prop) as { some, thing }, index (thing)}
  <p>{some}</p>
{/each}
// →
{
  type: 'svelteEachBlock',
  itemName: { type: 'svelteExpression', value: '{ some, thing }' },
  itemIndex: { type: 'svelteExpression', value: 'index' },
  itemKey: { type: 'svelteExpression', value: 'thing' },
  children: [{
    type: 'svelteElement',
    tagName: 'p',
    properties: [],
    selfClosing: false,
    children: [{ type: 'svelteExpression', value: 'some' }]
  }]
}
```

**Branch** (`type: 'svelteBranch'`): Branch of a block with `name`, `expression`, and `children`