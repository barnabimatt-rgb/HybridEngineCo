import { runPipeline } from "@hec/core";
import { createLogger } from "@hec/tools";

const log = createLogger("worker");

export async function processJob(job: any) {
  log("job_start", { job });

  try {
    const result = await runPipeline(job);
    log("job_complete", { result });
    return result;
  } catch (err) {
    log("job_error", { error: String(err) });
    throw err;
  }
}
