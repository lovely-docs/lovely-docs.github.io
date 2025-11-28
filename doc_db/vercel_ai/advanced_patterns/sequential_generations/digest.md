Sequential generations (chains/pipes) allow you to create workflows where the output of one generation becomes the input for the next, enabling dependent multi-step AI operations.

**Use Case**: Breaking down complex tasks into smaller, manageable steps where each step builds on the previous result.

**Implementation**: Use `generateText()` multiple times, passing the output from one call as input to the next. Example workflow:
1. Generate blog post ideas with `generateText()` using a prompt
2. Pass the generated ideas to another `generateText()` call to pick the best idea
3. Pass the selected idea to a third `generateText()` call to create an outline

Each generation is awaited sequentially, allowing you to access the full text output (via the `.text` property or direct string interpolation) and use it in subsequent prompts. This pattern works with any model available through the SDK.