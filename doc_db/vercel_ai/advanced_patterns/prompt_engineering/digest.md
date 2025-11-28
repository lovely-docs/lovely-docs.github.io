## What is a Large Language Model (LLM)?

LLMs are prediction engines that take word sequences as input and predict the most likely sequences to follow by assigning probabilities. They generate text iteratively until meeting a stopping criterion. Trained on massive text corpuses, they excel at tasks matching their training data (e.g., models trained on GitHub understand code well). Generated sequences can appear plausible but may not be grounded in reality.

## What is a prompt?

Prompts are the starting inputs that trigger LLMs to generate text. Prompt engineering encompasses crafting prompts and understanding related concepts: hidden prompts, tokens, token limits, and prompt hacking (jailbreaks, leaks).

## Why is prompt engineering needed?

Prompt engineering shapes LLM responses and enables them to handle broader query ranges using techniques like semantic search, command grammars, and ReActive architecture. Different models have varying performance, context windows, and costs—GPT-4 is more expensive and slower than GPT-3.5-turbo but more effective at certain tasks. Prompt engineering helps optimize the cost-performance tradeoff.

## Example: Slogan Generator

**Start with an instruction:** Clear instructions influence completions. "Create a slogan for a coffee shop" generates basic results, while "Create a slogan for an organic coffee shop" produces more targeted output by adding descriptive terms.

**Include examples:** Demonstrating expected output patterns improves results. Instead of "Create three slogans for a coffee shop with live music" (which may miss details), provide examples:
```
Business: Bookstore with cats
Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles"
Business: Gym with rock climbing
Slogans: "Peak Performance", "Reach New Heights", "Climb Your Way Fit"
Business: Coffee shop with live music
Slogans: [model generates better results]
```

**Tweak settings - Temperature:** Temperature (0-1) controls prediction confidence. At 0, identical prompts yield identical/nearly identical completions. At higher values (e.g., 1), the same prompt produces varied results. Lower temperature = more deterministic, precise completions; higher temperature = broader range of completions. For a slogan generator needing diverse suggestions, use moderate temperature around 0.6.

## Resources

- Vercel AI Playground for comparing model performance side-by-side and generating code
- Brex Prompt Engineering guide
- Prompt Engineering Guide by Dair AI