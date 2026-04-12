import express from "express";
import { runPipeline } from "@hec/core";
import { TopicAgent } from "@hec/agents";
import { createLogger } from "@hec/tools";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/pipelines/topic", async (req, res) => {
  const logger = createLogger("api:topic-pipeline");

  const steps = [
    {
      name: "topic-agent",
      run: async (input: any) => TopicAgent.run(input)
    }
  ];

  const result = await runPipeline(steps, req.body || {}, {
    runId: Date.now().toString(),
    logger
  });

  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on ${port}`);
});
