**installPolyfills()** - Makes web APIs (`crypto`, `File`) available as globals in Node.js environments.

```js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
installPolyfills();
```