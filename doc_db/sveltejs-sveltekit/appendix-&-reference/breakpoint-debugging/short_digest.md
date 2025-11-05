## Visual Studio Code

Debug terminal: `CMD/Ctrl` + `Shift` + `P` → "Debug: JavaScript Debug Terminal" → `npm run dev` → set breakpoints

Or use `.vscode/launch.json` with `"type": "node-terminal"` and start with `F5`.

## Browser DevTools

Run `NODE_OPTIONS="--inspect" npm run dev`, open `localhost:5173`, click "Open dedicated DevTools for Node.js" in dev tools, or navigate to `chrome://inspect`.