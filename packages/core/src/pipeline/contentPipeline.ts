import { PipelineStep } from "../../types";
import {
  TopicAgent,
  ScriptAgent,
  MetadataAgent,
  VoiceAgent,
  VideoAgent,
  ClipAgent,
  UploadAgent,
  BrandAgent,
  QualityAgent
} from "@hec/agents";

export const contentPipeline: PipelineStep[] = [
  {
    name: "topic-agent",
    run: (input, ctx) => TopicAgent.run(input)
  },
  {
    name: "script-agent",
    run: (input, ctx) => ScriptAgent.run(input)
  },
  {
    name: "metadata-agent",
    run: (input, ctx) => MetadataAgent.run(input)
  },
  {
    name: "brand-agent",
    run: (input, ctx) => BrandAgent.run(input)
  },
  {
    name: "voice-agent",
    run: (input, ctx) => VoiceAgent.run(input)
  },
  {
    name: "video-agent",
    run: (input, ctx) => VideoAgent.run(input)
  },
  {
    name: "clip-agent",
    run: (input, ctx) => ClipAgent.run(input)
  },
  {
    name: "upload-agent",
    run: (input, ctx) => UploadAgent.run(input)
  },
  {
    name: "quality-agent",
    run: (input, ctx) => QualityAgent.run(input)
  }
];
