import { Sponsor, SponsorsResponse, SponsorDetailResponse, SponsorFilters } from "@/types/sponsor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Fetch all sponsors with optional filters
 * This is prepared for backend integration
 */
export async function getSponsors(filters?: SponsorFilters): Promise<Sponsor[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.tier && filters.tier !== "all") {
      queryParams.append("tier", filters.tier);
    }
    if (filters?.featured !== undefined) {
      queryParams.append("featured", String(filters.featured));
    }
    if (filters?.active !== undefined) {
      queryParams.append("active", String(filters.active));
    }

    const url = `${API_BASE_URL}/sponsors${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache options as needed
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sponsors: ${response.statusText}`);
    }

    const data: SponsorsResponse = await response.json();
    return data.sponsors;
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    throw error;
  }
}

/**
 * Fetch a single sponsor by ID
 */
export async function getSponsorById(id: string): Promise<Sponsor> {
  try {
    const response = await fetch(`${API_BASE_URL}/sponsors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sponsor: ${response.statusText}`);
    }

    const data: SponsorDetailResponse = await response.json();
    return data.sponsor;
  } catch (error) {
    console.error("Error fetching sponsor:", error);
    throw error;
  }
}

/**
 * Fetch featured sponsors only
 */
export async function getFeaturedSponsors(): Promise<Sponsor[]> {
  return getSponsors({ featured: true, active: true });
}
