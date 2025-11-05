## Visual Studio Code

Use the built-in debug terminal:
1. Open command palette: `CMD/Ctrl` + `Shift` + `P`
2. Launch "Debug: JavaScript Debug Terminal"
3. Start your project: `npm run dev`
4. Set breakpoints in source code
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
Then use the "Run and Debug" pane to select and start debugging with `F5`.

## Other Editors

WebStorm and Neovim have community guides available for debugging Svelte applications.

## Browser DevTools for Node.js

Debug Node.js using Chrome or Edge DevTools:
1. Run: `NODE_OPTIONS="--inspect" npm run dev`
2. Open site at `localhost:5173`
3. Open browser dev tools and click "Open dedicated DevTools for Node.js" icon
4. Set breakpoints and debug

Alternatively, navigate to `chrome://inspect` or `edge://inspect` directly.