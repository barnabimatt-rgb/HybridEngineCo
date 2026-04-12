import { runPipeline } from "@hec/core";
import { TopicAgent } from "@hec/agents";
import { createLogger } from "@hec/tools";

async function main() {
  const logger = createLogger("worker:demo");

  const steps = [
    {
      name: "topic-agent",
      run: async (input: any) => TopicAgent.run(input)
    }
  ];

  const result = await runPipeline(steps, {}, {
    runId: Date.now().toString(),
    logger
  });

  logger("Pipeline finished", { result });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
