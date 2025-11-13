The `installPolyfills()` function makes web APIs (`crypto`, `File`) available as globals in Node.js:

```js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
installPolyfills();
```