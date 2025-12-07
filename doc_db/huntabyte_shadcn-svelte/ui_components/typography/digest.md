## Typography

No default typography styles are shipped. Use utility classes to style text elements.

### Heading Styles

**h1** - Large primary heading:
```svelte
<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Title
</h1>
```

**h2** - Secondary heading with bottom border:
```svelte
<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
  Subtitle
</h2>
```

**h3** - Tertiary heading:
```svelte
<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Heading</h3>
```

**h4** - Quaternary heading:
```svelte
<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Small heading</h4>
```

### Paragraph & Text

**p** - Standard paragraph with margin between siblings:
```svelte
<p class="leading-7 [&:not(:first-child)]:mt-6">Text content</p>
```

**Lead** - Emphasized introductory text:
```svelte
<p class="text-muted-foreground text-xl">Important intro text</p>
```

**Large** - Large bold text:
```svelte
<div class="text-lg font-semibold">Large text</div>
```

**Small** - Small text for labels:
```svelte
<small class="text-sm font-medium leading-none">Label</small>
```

**Muted** - Subtle secondary text:
```svelte
<p class="text-muted-foreground text-sm">Secondary text</p>
```

### Other Elements

**blockquote** - Quoted text with left border:
```svelte
<blockquote class="mt-6 border-l-2 pl-6 italic">
  "Quote text"
</blockquote>
```

**Inline code** - Code snippets within text:
```svelte
<code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
  code
</code>
```

**list** - Unordered list with disc bullets:
```svelte
<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

**table** - Responsive table with borders:
```svelte
<div class="my-6 w-full overflow-y-auto">
  <table class="w-full">
    <thead>
      <tr class="even:bg-muted m-0 border-t p-0">
        <th class="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
          Header
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="even:bg-muted m-0 border-t p-0">
        <td class="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
          Cell
        </td>
      </tr>
    </tbody>
  </table>
</div>
```