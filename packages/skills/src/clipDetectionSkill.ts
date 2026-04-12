import { Skill, SkillContext } from "./types";

export const ClipDetectionSkill: Skill = {
  name: "clip-detection",
  async apply(text: string): Promise<string> {
    // Placeholder: later this will mark timestamps / segments
    return text + "\n\n[Clip candidates identified here later.]";
  }
};
