"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LegacyContestLeaderboardRedirect() {
  const router = useRouter();
  const params = useParams();
  const contestId = Array.isArray((params as any)?.contestId)
    ? (params as any).contestId[0]
    : (params as any)?.contestId;

  useEffect(() => {
    if (contestId) router.replace(`/contests/${contestId}/leaderboard`);
    else router.replace(`/contests`);
  }, [contestId, router]);

  return null;
}
