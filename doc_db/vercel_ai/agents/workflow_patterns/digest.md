## Workflow Patterns for Agents

Combine building blocks to add structure and reliability to agents. Five main patterns:

**Sequential Processing (Chains)** - Steps execute in order, each step's output becomes the next step's input. Example: Generate marketing copy, evaluate quality metrics, regenerate if quality thresholds not met (call-to-action present, emotional appeal ≥7, clarity ≥7).

**Routing** - Model decides which path to take based on context and intermediate results. Example: Classify customer query (type: general/refund/technical, complexity: simple/complex), then route to appropriate model size and system prompt based on classification.

**Parallel Processing** - Independent subtasks execute simultaneously. Example: Run three specialized code reviews in parallel (security, performance, maintainability), each with different system prompts and schemas, then aggregate results.

**Orchestrator-Worker** - Primary model coordinates specialized workers. Each worker optimizes for specific subtasks while orchestrator maintains context. Example: Orchestrator plans feature implementation (files to create/modify/delete), then workers execute each change with specialized system prompts appropriate to the change type.

**Evaluator-Optimizer** - Dedicated evaluation steps assess intermediate results and trigger retries or corrective action. Example: Translate text, evaluate translation (quality score, tone/nuance/cultural accuracy), if below threshold regenerate with feedback, repeat up to 3 iterations.

## Design Considerations

Choose approach based on:
- **Flexibility vs Control** - How much freedom does LLM need vs how tightly constrain actions
- **Error Tolerance** - Consequences of mistakes in use case
- **Cost** - More complex systems mean more LLM calls
- **Maintenance** - Simpler architectures easier to debug

Start with simplest approach meeting needs. Add complexity by: breaking tasks into clear steps, adding tools for capabilities, implementing feedback loops, introducing multiple agents.