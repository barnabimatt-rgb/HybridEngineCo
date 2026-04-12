import { PipelineContext, PipelineStep, PipelineStepInput, PipelineStepOutput } from "../types";

export async function runPipeline(
  steps: PipelineStep[],
  initialInput: PipelineStepInput,
  ctx: PipelineContext
): Promise<PipelineStepOutput> {
  let current: PipelineStepOutput = { ...initialInput };

  for (const step of steps) {
    ctx.logger(`Running step: ${step.name}`);
    current = await step.run(current, ctx);
  }

  return current;
}
