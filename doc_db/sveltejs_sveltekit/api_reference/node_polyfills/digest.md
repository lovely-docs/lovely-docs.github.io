The `installPolyfills()` function from `@sveltejs/kit/node/polyfills` makes web APIs available as globals in Node.js environments.

**Available polyfills:**
- `crypto` - Web Crypto API
- `File` - File API

**Usage:**
```js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
installPolyfills();
```

Call this function to enable these web APIs when running SvelteKit code in Node.js contexts.