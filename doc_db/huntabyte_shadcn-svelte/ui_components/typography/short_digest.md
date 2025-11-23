## Heading Styles
- **h1**: scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl
- **h2**: scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0
- **h3**: scroll-m-20 text-2xl font-semibold tracking-tight
- **h4**: scroll-m-20 text-xl font-semibold tracking-tight

## Paragraph Styles
- **Standard**: leading-7 [&:not(:first-child)]:mt-6
- **Lead**: text-muted-foreground text-xl
- **Large**: text-lg font-semibold
- **Small**: text-sm font-medium leading-none
- **Muted**: text-muted-foreground text-sm

## Other Elements
- **Blockquote**: mt-6 border-l-2 pl-6 italic
- **Inline code**: bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold
- **List**: my-6 ml-6 list-disc [&>li]:mt-2
- **Table**: Wrapped in overflow container with w-full overflow-y-auto, bordered cells, bold headers, alternating backgrounds