Attaches automatically-disposed event listeners to DOM elements. Takes a function returning the target element, event name, and handler. Cleans up automatically on component destruction or element reference change.

**Example:** `useEventListener(() => document.body, "click", () => counter++)`