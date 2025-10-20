"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyTeamRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/contests");
  }, [router]);
  return null;
}
