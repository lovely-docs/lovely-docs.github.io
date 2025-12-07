## Visual Studio Code

Use the built-in debug terminal to set breakpoints in source files:

1. Open command palette: `CMD/Ctrl` + `Shift` + `P`
2. Launch "Debug: JavaScript Debug Terminal"
3. Start your project: `npm run dev`
4. Set breakpoints in client or server-side source code
5. Trigger the breakpoint

Alternatively, set up `.vscode/launch.json`:

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"command": "npm run dev",
			"name": "Run development server",
			"request": "launch",
			"type": "node-terminal"
		}
	]
}
```

Then use the "Run and Debug" pane to select the run script and press the play button or hit `F5`.

## Other Editors

- WebStorm: Use built-in Svelte debugging support
- Neovim: Community guides available for JavaScript framework debugging

## Browser DevTools (Chrome/Edge)

Debug Node.js applications using browser-based debugger (client-side source maps only):

1. Run: `NODE_OPTIONS="--inspect" npm run dev`
2. Open site at `localhost:5173`
3. Open browser dev tools and click "Open dedicated DevTools for Node.js" icon (Node.js logo)
4. Set breakpoints and debug

Alternatively, navigate to `chrome://inspect` (Chrome) or `edge://inspect` (Edge).