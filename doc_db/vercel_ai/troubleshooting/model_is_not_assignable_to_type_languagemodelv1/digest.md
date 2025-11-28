## Problem
After updating the AI SDK, you encounter a TypeScript error: `Type 'SomeModel' is not assignable to type 'LanguageModelV1'`. Similar errors can occur with `EmbeddingModelV3`.

## Cause
New features added to the model specification can create incompatibilities between the AI SDK and older provider package versions.

## Solution
Update both your provider packages and the AI SDK to their latest versions to resolve the type incompatibility.