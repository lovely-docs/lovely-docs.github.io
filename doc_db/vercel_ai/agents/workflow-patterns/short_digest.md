Five workflow patterns for agents:

1. **Sequential Processing**: Steps execute in order, each output feeds next step. Example: generate marketing copy → evaluate quality → regenerate if needed.

2. **Routing**: Model decides execution path based on context. Example: classify customer query → route to appropriate model/system prompt based on type and complexity.

3. **Parallel Processing**: Independent subtasks run simultaneously. Example: parallel code review with security, performance, and maintainability specialists running concurrently.

4. **Orchestrator-Worker**: Primary model plans, specialized workers execute. Example: architect plans feature implementation → workers create/modify/delete files based on plan.

5. **Evaluator-Optimizer**: Evaluation steps assess results, trigger retries or corrections. Example: translate text → evaluate quality → regenerate if below threshold (max 3 iterations).

Design considerations: flexibility vs control, error tolerance, cost (more calls = higher cost), maintenance complexity. Start simple, add complexity only when needed.