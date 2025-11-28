## useCompletion Hook

Streaming text completion hook with state management for input and completion output.

### Key Parameters
- **api**: Endpoint URL (default: '/api/completion')
- **id**: Shared state identifier across components
- **initialInput/initialCompletion**: Initial values
- **onFinish/onError**: Callbacks for completion lifecycle
- **headers/body/credentials**: Request configuration
- **streamProtocol**: 'text' or 'data' (default: 'data')
- **experimental_throttle**: Throttle UI updates during streaming (React only)

### Key Returns
- **completion**: Current completion text
- **complete(prompt, options)**: Execute completion
- **input/setInput**: Input state management
- **handleInputChange/handleSubmit**: Form handlers
- **isLoading**: Fetch in progress flag
- **error/stop**: Error handling and abort