## installPolyfills

Installs polyfills for web APIs that are not available in Node.js environments, making them available as globals.

**Polyfilled APIs:**
- `crypto` - cryptographic functions
- `File` - File API for handling file objects

**Usage:**
```js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
installPolyfills();
```

Call `installPolyfills()` once to enable these web APIs in Node.js contexts, such as server-side code or build scripts.