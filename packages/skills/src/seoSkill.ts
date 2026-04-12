import { Skill, SkillContext } from "./types";

export const SeoSkill: Skill = {
  name: "seo",
  async apply(text: string, ctx: SkillContext = {}): Promise<string> {
    const base = text.trim();
    const keyword = (ctx.keyword as string) || "AI automation";

    const optimized = `${base}\n\nKeywords: ${keyword}, content engine, creator workflow`;
    return optimized;
  }
};
