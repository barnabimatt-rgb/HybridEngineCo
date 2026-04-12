export interface SkillContext {
  [key: string]: unknown;
}

export interface Skill {
  name: string;
  apply: (text: string, ctx?: SkillContext) => Promise<string>;
}
