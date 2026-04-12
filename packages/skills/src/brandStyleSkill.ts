import { Skill, SkillContext } from "./types";

export const BrandStyleSkill: Skill = {
  name: "brand-style",
  async apply(text: string, ctx: SkillContext = {}): Promise<string> {
    const tone = (ctx.tone as string) || "friendly";
    const style = (ctx.style as string) || "educational";

    return `[Tone: ${tone} | Style: ${style}]\n\n${text}`;
  }
};
