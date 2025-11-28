OpenAIStream is a legacy helper function that transforms responses from OpenAI's language models into a ReadableStream. It has been removed in AI SDK 4.0 and is not compatible with AI SDK 3.1 functions - the AI SDK OpenAI Provider should be used instead.

The function accepts a Response object from the OpenAI Provider SDK and optional callbacks for stream processing:
- `onStart()`: Called at the beginning of stream processing
- `onToken(token: string)`: Called for each token in the stream
- `onCompletion(completion: string)`: Called for every completion
- `onFinal(completion: string)`: Called once when the stream closes with the final message

Prior to v4, the official OpenAI API SDK did not support the Edge Runtime and only worked in serverless environments. The openai-edge package (based on fetch instead of axios) works in the Edge Runtime, so openai v4+ or openai-edge is recommended.

Import: `import { OpenAIStream } from "ai"`