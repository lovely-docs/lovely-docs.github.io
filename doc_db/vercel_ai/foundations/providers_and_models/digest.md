## Overview

The AI SDK provides a standardized interface for interacting with large language models (LLMs) from different providers through a unified language model specification. This abstraction layer eliminates vendor lock-in and allows switching between providers without changing application code.

## Architecture

The AI SDK uses a language model specification (published as open-source) that abstracts provider differences, enabling the same API to work across all providers.

## Official Providers

The SDK includes 25+ official providers:

- **LLM Providers**: xAI Grok, OpenAI, Azure OpenAI, Anthropic, Amazon Bedrock, Google Generative AI, Google Vertex, Mistral, Together.ai, Cohere, Fireworks, DeepInfra, DeepSeek, Cerebras, Groq, Perplexity
- **Specialized Providers**: ElevenLabs, LMNT, Hume, Rev.ai, Deepgram, Gladia, AssemblyAI, Baseten, Vercel

## OpenAI-Compatible Providers

For APIs compatible with OpenAI specification:
- LM Studio
- Heroku

## Community Providers

The open-source community has created 25+ additional providers including: Ollama, FriendliAI, Portkey, Cloudflare Workers AI, OpenRouter, Aihubmix, Requesty, Crosshatch, Mixedbread, Voyage AI, Mem0, Letta, Supermemory, Spark, AnthropicVertex, LangDB, Dify, Sarvam, Claude Code, Built-in AI, Gemini CLI, A2A, SAP-AI, AI/ML API, MCP Sampling, ACP.

## Self-Hosted Models

Access self-hosted models through: Ollama, LM Studio, Baseten, Built-in AI, or any provider supporting OpenAI specification.

## Model Capabilities

Popular models support varying capabilities:

| Provider | Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----------|-------|-------------|-------------------|------------|----------------|
| xAI Grok | grok-4, grok-3, grok-3-fast, grok-3-mini, grok-3-mini-fast, grok-2-1212 | ✗ | ✓ | ✓ | ✓ |
| xAI Grok | grok-2-vision-1212, grok-vision-beta | ✓ | ✓/✗ | ✓/✗ | ✓/✗ |
| OpenAI | gpt-5, gpt-5-mini, gpt-5-nano, gpt-5.1-chat-latest, gpt-5.1-codex-mini, gpt-5.1-codex, gpt-5.1, gpt-5-codex, gpt-5-chat-latest | ✓ | ✓ | ✓ | ✓ |
| Anthropic | claude-opus-4-5, claude-opus-4-1, claude-opus-4-0, claude-sonnet-4-0, claude-3-7-sonnet-latest, claude-3-5-haiku-latest | ✓ | ✓ | ✓ | ✓ |
| Mistral | pixtral-large-latest, mistral-large-latest, mistral-medium-latest, mistral-medium-2505, mistral-small-latest, pixtral-12b-2409 | ✓/✗ | ✓ | ✓ | ✓ |
| Google Generative AI | gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro | ✓ | ✓ | ✓ | ✓ |
| Google Vertex | gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro | ✓ | ✓ | ✓ | ✓ |
| DeepSeek | deepseek-chat, deepseek-reasoner | ✗ | ✓/✗ | ✓/✗ | ✓/✗ |
| Cerebras | llama3.1-8b, llama3.1-70b, llama3.3-70b | ✗ | ✓ | ✓ | ✓ |
| Groq | meta-llama/llama-4-scout-17b-16e-instruct, llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768, gemma2-9b-it | ✓/✗ | ✓ | ✓ | ✓ |
| Vercel | v0-1.0-md | ✓ | ✓ | ✓ | ✓ |

Additional models available in provider documentation.