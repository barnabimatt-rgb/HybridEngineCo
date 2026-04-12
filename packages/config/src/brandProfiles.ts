export interface BrandProfile {
  id: string;
  name: string;
  tone: string;
  style: string;
  formatting: string;
  tagline?: string;
}

export const defaultBrand: BrandProfile = {
  id: "default",
  name: "Hybrid Engine Co.",
  tone: "friendly, direct, no fluff",
  style: "educational, systems-focused",
  formatting: "short paragraphs, clear sections, minimal fluff",
  tagline: "Modular content engines for serious builders."
};

export const brandProfiles: Record<string, BrandProfile> = {
  default: defaultBrand
};
