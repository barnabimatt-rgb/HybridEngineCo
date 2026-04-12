import { Router } from "express";
import { runPipeline } from "@hec/core";
import { contentPipeline } from "@hec/core/src/pipeline/pipelines/contentPipeline";
import { createLogger } from "@hec/tools";

const router = Router();

router.post("/content", async (req, res) => {
  const logger = createLogger("api:content-pipeline");
  const runId = Date.now().toString();

  const result = await runPipeline(
    contentPipeline,
    { ...req.body, runId },
    { runId, logger }
  );

  res.json(result);
});

export default router;
