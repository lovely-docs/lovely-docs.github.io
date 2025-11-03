## Transitions

Use `transition:` directive for bidirectional animations when elements enter/leave DOM:

```svelte
<div transition:fade>fades in and out</div>
<div transition:fade|global>plays on parent changes too</div>
<div transition:fade={{ duration: 2000 }}>custom duration</div>
```

Custom transitions return object with `css` or `tick` function:

```js
function whoosh(node, params) {
  return {
    duration: 400,
    css: (t, u) => `transform: scale(${t})`
  };
}
```

Events: `introstart`, `introend`, `outrostart`, `outroend`