export interface AgentInput {
  [key: string]: unknown;
}

export interface AgentOutput {
  [key: string]: unknown;
}

export interface Agent {
  name: string;
  run(input: AgentInput): Promise<AgentOutput>;
}
