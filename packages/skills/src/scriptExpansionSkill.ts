import { Skill, SkillContext } from "./types";

export const ScriptExpansionSkill: Skill = {
  name: "script-expansion",
  async apply(text: string): Promise<string> {
    const extra = "\n\n[More detail will be added here later by LLMs and templates.]";
    return text + extra;
  }
};
