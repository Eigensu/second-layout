// Sponsor tier types
export type SponsorTier = "platinum" | "gold" | "silver" | "bronze";

// Sponsor interface - matches the expected backend structure
export interface Sponsor {
  id: string;
  name: string;
  logo: string; // URL or path to the sponsor logo image
  tier: SponsorTier;
  description: string;
  website: string;
  featured?: boolean;
  active?: boolean; // Whether the sponsor is currently active
  createdAt?: string;
  updatedAt?: string;
}

// API response types for when you connect to backend
export interface SponsorsResponse {
  sponsors: Sponsor[];
  total: number;
}

export interface SponsorDetailResponse {
  sponsor: Sponsor;
}

// Filter options for sponsors
export interface SponsorFilters {
  tier?: SponsorTier | "all";
  featured?: boolean;
  active?: boolean;
}
