import { useEffect, useMemo, useState } from "react";
import { getSponsors } from "@/lib/api/sponsors";

export type Tier = "platinum" | "gold" | "silver" | "bronze";

export interface UISponsor {
  id: string;
  name: string;
  logo: string;
  tier: Tier;
  description: string;
  website: string;
  featured?: boolean;
  active?: boolean;
}

export function useSponsorsPage() {
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [sponsors, setSponsors] = useState<UISponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getSponsors({ active: true });
        if (mounted) setSponsors(data as UISponsor[]);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load sponsors");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const featuredSponsors = useMemo(
    () => sponsors.filter((s) => s.featured),
    [sponsors]
  );

  const filteredSponsors = useMemo(() => {
    if (selectedTier === "all") return sponsors;
    return sponsors.filter((s) => s.tier === (selectedTier as Tier));
  }, [sponsors, selectedTier]);

  const tierCounts = useMemo(
    () => ({
      platinum: sponsors.filter((s) => s.tier === "platinum").length,
      gold: sponsors.filter((s) => s.tier === "gold").length,
      silver: sponsors.filter((s) => s.tier === "silver").length,
      bronze: sponsors.filter((s) => s.tier === "bronze").length,
    }),
    [sponsors]
  );

  return {
    // state
    selectedTier,
    setSelectedTier,
    sponsors,
    loading,
    error,
    // derived
    featuredSponsors,
    filteredSponsors,
    tierCounts,
  } as const;
}
