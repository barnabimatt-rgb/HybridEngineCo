export interface SkillContext {
  [key: string]: unknown;
}

export interface Skill {
  name: string;
  apply: (text: string, ctx?: SkillContext) => Promise<string>;
}

export const EchoSkill: Skill = {
  name: "echo",
  async apply(text: string): Promise<string> {
    return text;
  }
};
