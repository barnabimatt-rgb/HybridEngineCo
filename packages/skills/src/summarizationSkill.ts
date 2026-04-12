import { Skill, SkillContext } from "./types";

export const SummarizationSkill: Skill = {
  name: "summarization",
  async apply(text: string): Promise<string> {
    if (text.length <= 280) return text;
    return text.slice(0, 277) + "...";
  }
};
