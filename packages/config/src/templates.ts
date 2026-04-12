export interface ScriptTemplate {
  id: string;
  name: string;
  pattern: string;
}

export interface MetadataTemplate {
  id: string;
  name: string;
  titlePattern: string;
  descriptionPattern: string;
}

export const scriptTemplates: ScriptTemplate[] = [
  {
    id: "yt-educational-1",
    name: "YouTube Educational Breakdown",
    pattern: `
[Hook]
- Strong, specific promise in one sentence.

[Context]
- Why this matters right now.

[Steps]
- Step 1:
- Step 2:
- Step 3:

[Wrap]
- Quick recap.
- Simple next action.
`.trim()
  }
];

export const metadataTemplates: MetadataTemplate[] = [
  {
    id: "yt-default-1",
    name: "YouTube Default",
    titlePattern: "How to {{topic}} (Without Burning Out)",
    descriptionPattern: `
In this video, you'll learn how to {{topic}} using a modular, repeatable system.

What you'll get:
- Clear steps
- No fluff
- Real examples

Built with Hybrid Engine Co.
`.trim()
  }
];
