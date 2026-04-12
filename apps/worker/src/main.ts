import { runPipeline } from "@hec/core";
import { contentPipeline } from "@hec/core/src/pipeline/pipelines/contentPipeline";
import { createLogger } from "@hec/tools";

async function main() {
  const logger = createLogger("worker:content");

  const result = await runPipeline(contentPipeline, {}, {
    runId: Date.now().toString(),
    logger
  });

  logger("Pipeline finished", { result });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
