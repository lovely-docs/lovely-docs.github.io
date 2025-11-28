## useCompletion Hook

Creates text completion capabilities with streaming support from AI providers. Manages state for input and completion, automatically updates UI as responses arrive.

### Imports
- React: `import { useCompletion } from '@ai-sdk/react'`
- Svelte: `import { Completion } from '@ai-sdk/svelte'`
- Vue: `import { useCompletion } from '@ai-sdk/vue'`

### Parameters

**api** (string, default: '/api/completion'): Endpoint for text generation, can be relative or absolute URL.

**id** (string): Unique identifier for the completion. When provided, multiple `useCompletion` hooks with the same id share state across components, useful for displaying the same stream in multiple places.

**initialInput** (string): Optional initial prompt input value.

**initialCompletion** (string): Optional initial completion result value.

**onFinish** ((prompt: string, completion: string) => void): Callback when completion stream ends.

**onError** ((error: Error) => void): Callback when stream encounters an error.

**headers** (Record<string, string> | Headers): Optional headers for API request.

**body** (any): Optional additional body object for API request.

**credentials** ('omit' | 'same-origin' | 'include', default: 'same-origin'): Sets credentials mode for the request.

**streamProtocol** ('text' | 'data', default: 'data'): Stream type - 'text' treats as text stream, 'data' for data stream.

**fetch** (FetchFunction): Custom fetch function, defaults to global fetch.

**experimental_throttle** (number, React only): Throttle wait time in milliseconds for UI updates during streaming. Undefined disables throttling.

### Returns

**completion** (string): Current text completion value.

**complete** ((prompt: string, options: { headers, body }) => void): Execute text completion for given prompt.

**error** (undefined | Error): Error from completion process if any.

**setCompletion** ((completion: string) => void): Update completion state.

**stop** (() => void): Abort current API request.

**input** (string): Current input field value.

**setInput** (React.Dispatch<React.SetStateAction<string>>): Update input state.

**handleInputChange** ((event: any) => void): onChange handler for input field to control its value.

**handleSubmit** ((event?: { preventDefault?: () => void }) => void): Form submission handler that resets input and appends user message.

**isLoading** (boolean): Flag indicating if fetch operation is in progress.