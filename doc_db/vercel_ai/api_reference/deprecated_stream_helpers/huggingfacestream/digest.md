HuggingFaceStream has been removed in AI SDK 4.0 and is part of the legacy Hugging Face integration, incompatible with AI SDK 3.1 functions.

The function converts output from language models hosted on Hugging Face into a ReadableStream. It works with most Hugging Face language models, though rapidly evolving models may not be supported.

The function standardizes responses by removing special end-of-response tokens (`</s>` and `<|endoftext|>`) to ensure AI responses contain only text without delimiters that could cause rendering issues in chat or completion modes.

**Import:**
```
import { HuggingFaceStream } from "ai"
```

**Parameters:**
- `iter` (AsyncGenerator<any>, required): The generator function returned by `hf.textGenerationStream` method from the Hugging Face Inference SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object containing callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final completion message

**Returns:** ReadableStream