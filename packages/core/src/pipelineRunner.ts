import { pipelineGraph } from "./pipelineGraph";
import { agents } from "@hec/agents";
import { wrapAgentError } from "./pipelineError";
import { createLogger } from "@hec/tools";

const log = createLogger("core:pipeline");

export async function runPipeline(initialInput: any) {
  let state = { ...initialInput };

  for (const agentName of pipelineGraph) {
    const agent = agents[agentName];
    if (!agent) throw new Error(`Agent not found: ${agentName}`);

    log("agent_start", { agent: agentName });

    try {
      state = await agent.run(state);
    } catch (err) {
      const wrapped = wrapAgentError(agentName, err);
      log("agent_error", { agent: agentName, error: wrapped });
      throw wrapped;
    }

    log("agent_complete", { agent: agentName });
  }

  return state;
}
