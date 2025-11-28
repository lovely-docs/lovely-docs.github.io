## Unified Provider Interface

AI SDK abstracts differences between LLM providers through a standardized language model specification, enabling seamless provider switching without code changes.

## Available Providers

**Official (25+)**: xAI Grok, OpenAI, Azure OpenAI, Anthropic, Amazon Bedrock, Google Generative AI, Google Vertex, Mistral, Together.ai, Cohere, Fireworks, DeepInfra, DeepSeek, Cerebras, Groq, Perplexity, ElevenLabs, LMNT, Hume, Rev.ai, Deepgram, Gladia, AssemblyAI, Baseten, Vercel

**OpenAI-Compatible**: LM Studio, Heroku

**Community (25+)**: Ollama, FriendliAI, Portkey, Cloudflare Workers AI, OpenRouter, Aihubmix, Requesty, Crosshatch, Mixedbread, Voyage AI, Mem0, Letta, Supermemory, Spark, AnthropicVertex, LangDB, Dify, Sarvam, Claude Code, Built-in AI, Gemini CLI, A2A, SAP-AI, AI/ML API, MCP Sampling, ACP

**Self-Hosted**: Ollama, LM Studio, Baseten, Built-in AI, or any OpenAI-compatible provider

## Model Capabilities

Popular models vary in support for: image input, object generation, tool usage, and tool streaming. Examples: GPT-5 series (all capabilities), Claude Opus/Sonnet (all capabilities), Gemini 2.0/1.5 (all capabilities), Llama models via Groq/Cerebras (no image input), DeepSeek Reasoner (limited capabilities).