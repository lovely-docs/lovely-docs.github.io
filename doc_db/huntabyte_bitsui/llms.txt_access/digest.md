## LLM-Friendly Documentation Access

Bits UI documentation supports the llms.txt standard for machine-readable format optimized for LLMs.

### Accessing LLM-friendly versions

Append `/llms.txt` to any documentation page URL to get the LLM-optimized version:
- Standard: `bits-ui.com/docs/components/accordion`
- LLM-friendly: `bits-ui.com/docs/components/accordion/llms.txt`

### Available endpoints

- **Root index**: `bits-ui.com/llms.txt` - lists all supported pages in LLM-friendly format
- **Full documentation**: `bits-ui.com/docs/llms.txt` - consolidated view of all documentation in machine-readable structure

### Copy Markdown button

Each documentation page has a "Copy Markdown" button at the top that provides the same content as the `/llms.txt` version of that page.

### Notes

- Not all pages support `/llms.txt` (e.g., Figma page). Check the root index for current list of compatible URLs.
- The llms.txt standard is an emerging convention for simplified, text-based documentation format easy for LLMs to process.