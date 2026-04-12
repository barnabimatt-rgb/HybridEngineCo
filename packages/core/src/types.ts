export interface PipelineContext {
  runId: string;
  logger: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface PipelineStepInput {
  [key: string]: unknown;
}

export interface PipelineStepOutput {
  [key: string]: unknown;
}

export interface PipelineStep {
  name: string;
  run: (
    input: PipelineStepInput,
    ctx: PipelineContext
  ) => Promise<PipelineStepOutput>;
}
