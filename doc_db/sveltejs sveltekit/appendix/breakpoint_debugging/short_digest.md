**VSCode**: Use Debug Terminal (Cmd+Shift+P → "Debug: JavaScript Debug Terminal") or create `.vscode/launch.json` with `"type": "node-terminal"` and `"command": "npm run dev"` to set breakpoints.

**Browser DevTools**: Run `NODE_OPTIONS="--inspect" npm run dev`, open `localhost:5173`, click Node.js DevTools icon in browser DevTools, or navigate to `chrome://inspect`/`edge://inspect`.

**Other Editors**: WebStorm and Neovim have community debugging guides available.