## $effect

Effects run when state updates and are browser-only (not during SSR). Use them for third-party libraries, canvas drawing, or network requests. Avoid updating state inside effects as it causes convoluted code and infinite loops.

### Basic Usage

Effects automatically track reactive values (`$state`, `$derived`, `$props`) accessed synchronously and re-run when dependencies change:

```svelte
<script>
    let size = $state(50);
    let color = $state('#ff3e00');
    let canvas;

    $effect(() => {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = color;
        context.fillRect(0, 0, size, size);
    });
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

### Lifecycle

Effects run after component mount in a microtask after state changes. Multiple state changes in the same moment trigger one re-run. Effects can return a teardown function that runs before re-runs and on component destruction:

```svelte
<script>
    let count = $state(0);
    let milliseconds = $state(1000);

    $effect(() => {
        const interval = setInterval(() => {
            count += 1;
        }, milliseconds);

        return () => clearInterval(interval);
    });
</script>
```

### Understanding Dependencies

Values read asynchronously (after `await` or in `setTimeout`) are not tracked. Effects only depend on values read in the last run, so conditional code affects which dependencies are tracked:

```ts
let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
    if (condition) {
        confetti({ colors: [color] });
    } else {
        confetti();
    }
});
// If condition is true, both condition and color are dependencies
// If condition is false, only condition is a dependency
```

Effects only re-run when the object itself changes, not when properties inside it change. Use `$derived` for derived state instead of effects.

### $effect.pre

Runs code before DOM updates:

```svelte
<script>
    let div = $state();
    let messages = $state([]);

    $effect.pre(() => {
        if (!div) return;
        messages.length; // reference to track changes
        
        if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
            tick().then(() => {
                div.scrollTo(0, div.scrollHeight);
            });
        }
    });
</script>
```

### $effect.tracking

Returns whether code is running in a tracking context (effect or template):

```svelte
<script>
    console.log('setup:', $effect.tracking()); // false
    $effect(() => {
        console.log('in effect:', $effect.tracking()); // true
    });
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

### $effect.root

Creates a non-tracked scope for manually controlled nested effects:

```js
const destroy = $effect.root(() => {
    $effect(() => {
        // setup
    });
    return () => {
        // cleanup
    };
});

destroy();
```

### When Not to Use $effect

Don't use effects to synchronize state. Use `$derived` instead:

```svelte
<!-- Don't do this -->
<script>
    let count = $state(0);
    let doubled = $state();
    $effect(() => {
        doubled = count * 2;
    });
</script>

<!-- Do this -->
<script>
    let count = $state(0);
    let doubled = $derived(count * 2);
</script>
```

For complex derived values, use `$derived.by`. Avoid effects for linking values; use callbacks or function bindings instead.