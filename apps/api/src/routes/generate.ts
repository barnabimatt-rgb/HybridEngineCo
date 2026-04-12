import { runPipeline } from "@hec/core";
import { Router } from "express";

const router = Router();

router.post("/generate", async (req, res) => {
  try {
    const runId = Date.now().toString();

    const result = await runPipeline({
      runId,
      topic: req.body.topic,
      brand: req.body.brand ?? "default"
    });

    res.json({
      success: true,
      runId,
      result
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
      code: err.code ?? "UNKNOWN"
    });
  }
});

export default router;
