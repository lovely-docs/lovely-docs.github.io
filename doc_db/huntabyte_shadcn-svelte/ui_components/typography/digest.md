## Typography Utility Classes

No typography styles are shipped by default. Use Tailwind utility classes to style text elements.

### Headings
- **h1**: `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`
- **h2**: `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0`
- **h3**: `scroll-m-20 text-2xl font-semibold tracking-tight`
- **h4**: `scroll-m-20 text-xl font-semibold tracking-tight`

### Paragraphs
- **Default**: `leading-7 [&:not(:first-child)]:mt-6`
- **Lead**: `text-muted-foreground text-xl`
- **Large**: `text-lg font-semibold`
- **Small**: `text-sm font-medium leading-none`
- **Muted**: `text-muted-foreground text-sm`

### Other Elements
- **Blockquote**: `mt-6 border-l-2 pl-6 italic`
- **Inline code**: `bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold`
- **List**: `my-6 ml-6 list-disc [&>li]:mt-2`
- **Table wrapper**: `my-6 w-full overflow-y-auto`
- **Table**: `w-full`
- **Table header row**: `even:bg-muted m-0 border-t p-0`
- **Table header cell**: `border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right`
- **Table body row**: `even:bg-muted m-0 border-t p-0`
- **Table body cell**: `border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right`