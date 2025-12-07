**DEPRECATED**: HuggingFaceStream has been removed in AI SDK 4.0 and is part of the legacy Hugging Face integration, incompatible with AI SDK 3.1 functions.

**Purpose**: Converts output from language models hosted on Hugging Face into a ReadableStream.

**Import**:
```javascript
import { HuggingFaceStream } from "ai"
```

**API Signature**:
- `HuggingFaceStream(iter, callbacks?)`

**Parameters**:
- `iter` (AsyncGenerator<any>, required): The generator function returned by `hf.textGenerationStream()` from the Hugging Face Inference SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with callback functions:
  - `onStart()`: Called at stream start
  - `onToken(token: string)`: Called for each token
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: ReadableStream

**Behavior**: Standardizes responses by removing special end-of-response tokens (`</s>` and `<|endoftext|>`) to ensure pure text output without delimiters that could cause rendering issues in chat/completion modes. Compatible with most Hugging Face language models, though rapidly evolving model landscape may result in some new/niche models not being supported.