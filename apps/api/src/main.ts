import express from "express";
import contentRoutes from "./routes/content";

const app = express();
app.use(express.json());

app.use("/pipelines", contentRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on ${port}`));
