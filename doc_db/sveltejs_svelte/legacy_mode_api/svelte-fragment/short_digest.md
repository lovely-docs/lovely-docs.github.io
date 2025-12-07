`<svelte:fragment>` places content in named slots without adding a container DOM element. Useful for preserving document flow when filling slots with multiple elements.

Example: `<svelte:fragment slot="footer"><p>Content</p><p>More</p></svelte:fragment>` renders both paragraphs without a wrapper. Obsolete in Svelte 5+ (snippets don't wrap).