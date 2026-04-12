import { TopicAgent } from "./topicAgent";
import { ScriptAgent } from "./scriptAgent";
import { MetadataAgent } from "./metadataAgent";
import { BrandAgent } from "./brandAgent";
import { VoiceAgent } from "./voiceAgent";
import { VideoAgent } from "./videoAgent";
import { ClipAgent } from "./clipAgent";
import { ThumbnailAgent } from "./thumbnailAgent";
import { UploadAgent } from "./uploadAgent";

export const agents: Record<string, any> = {
  "topic-agent": TopicAgent,
  "script-agent": ScriptAgent,
  "metadata-agent": MetadataAgent,
  "brand-agent": BrandAgent,
  "voice-agent": VoiceAgent,
  "video-agent": VideoAgent,
  "clip-agent": ClipAgent,
  "thumbnail-agent": ThumbnailAgent,
  "upload-agent": UploadAgent
};
