## Five Workflow Patterns

**Sequential Processing** - Steps in order, each output feeds next input. Example: generate marketing copy → evaluate quality → regenerate if thresholds not met.

**Routing** - Model decides execution path. Example: classify query type/complexity → route to appropriate model size and system prompt.

**Parallel Processing** - Independent tasks run simultaneously. Example: three specialized code reviews (security/performance/maintainability) in parallel, aggregate results.

**Orchestrator-Worker** - Coordinator with specialized workers. Example: orchestrator plans feature (files to create/modify/delete) → workers execute each with appropriate system prompt.

**Evaluator-Optimizer** - Evaluation steps trigger retries/corrections. Example: translate → evaluate (quality/tone/nuance/cultural accuracy) → regenerate if below threshold, max 3 iterations.

Design considerations: flexibility vs control, error tolerance, cost, maintenance. Start simple, add complexity only when needed.