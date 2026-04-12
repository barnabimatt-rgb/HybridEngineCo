import { Skill, SkillContext } from "./types";

export const TrendPredictionSkill: Skill = {
  name: "trend-prediction",
  async apply(text: string, ctx: SkillContext = {}): Promise<string> {
    const niche = (ctx.niche as string) || "AI tools";
    const prediction = `Upcoming trend in ${niche}: short, high-signal breakdowns with strong hooks.`;
    return `${text}\n\nTrend Insight: ${prediction}`;
  }
};
