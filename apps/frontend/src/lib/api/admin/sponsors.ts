import apiClient from "../client";
import { API } from "@/common/consts";
import type { Sponsor, SponsorTier } from "@/types/sponsor";

export interface SponsorCreateInput {
  name: string;
  logo: string;
  tier: SponsorTier;
  description: string;
  website: string;
  featured?: boolean;
  active?: boolean;
  display_order?: number;
}

export async function createSponsor(
  input: SponsorCreateInput
): Promise<Sponsor> {
  const response = await apiClient.post(`${API.PREFIX}/v1/sponsors`, input, {
    headers: { "Content-Type": "application/json" },
  });
  const s = (response.data?.sponsor ?? response.data) as any;
  const sponsor: Sponsor = {
    id: s.id ?? s._id,
    name: s.name,
    logo: s.logo,
    tier: s.tier,
    description: s.description,
    website: s.website,
    featured: s.featured,
    active: s.active,
    createdAt: s.createdAt ?? s.created_at,
    updatedAt: s.updatedAt ?? s.updated_at,
  };
  return sponsor;
}

export async function uploadSponsorLogo(
  sponsorId: string,
  file: File
): Promise<{ url: string; message: string }> {
  const form = new FormData();
  form.append("file", file);
  const response = await apiClient.post(
    `${API.PREFIX}/v1/sponsors/${sponsorId}/upload-logo`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
}

export interface SponsorUpdateInput {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
  featured?: boolean;
  active?: boolean;
  tier?: SponsorTier;
}

export async function updateSponsor(
  sponsorId: string,
  input: SponsorUpdateInput
): Promise<Sponsor> {
  const response = await apiClient.put(
    `${API.PREFIX}/v1/sponsors/${sponsorId}`,
    input,
    { headers: { "Content-Type": "application/json" } }
  );
  const s = (response.data?.sponsor ?? response.data) as any;
  const sponsor: Sponsor = {
    id: s.id ?? s._id,
    name: s.name,
    logo: s.logo,
    tier: s.tier,
    description: s.description,
    website: s.website,
    featured: s.featured,
    active: s.active,
    createdAt: s.createdAt ?? s.created_at,
    updatedAt: s.updatedAt ?? s.updated_at,
  };
  return sponsor;
}
