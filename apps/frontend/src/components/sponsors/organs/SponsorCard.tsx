import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import Image from "next/image";
import { getSponsorLogo } from "@/components/sponsors/assets";
import { useState } from "react";

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  description: string;
  website: string;
  featured?: boolean;
}

interface SponsorCardProps {
  sponsor: Sponsor;
  featured?: boolean;
}

const cardTheme = {
  gradient: "from-primary-300 via-primary-400 to-primary-500",
  bg: "bg-gradient-to-br from-primary-50 to-primary-100",
  badge: "bg-gradient-to-r from-primary-500 to-primary-700",
  ring: "ring-primary-300",
};

export function SponsorCard({ sponsor, featured = false }: SponsorCardProps) {
  const localLogo = getSponsorLogo({
    id: sponsor.id,
    name: sponsor.name,
    description: sponsor.description,
  });
  const displayLogo = localLogo ?? sponsor.logo;
  const [imgSrc, setImgSrc] = useState(displayLogo);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
        featured ? "ring-2 " + cardTheme.ring : "border border-gray-200"
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <div
            className={`${cardTheme.badge} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}
          >
            <Award className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Tier Badge removed */}

      {/* Logo Container with light background and subtle drop shadow on logo */}
      <div
        className={`relative h-48 ${cardTheme.bg} flex items-center justify-center p-8`}
      >
        <div className="relative w-full h-full">
          <Image
            src={imgSrc}
            alt={`${sponsor.name} logo`}
            fill
            className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              if (imgSrc !== sponsor.logo) setImgSrc(sponsor.logo);
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight line-clamp-1">
          {sponsor.name}
        </h3>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {sponsor.description}
        </p>

        {/* Visit Website Button */}
        <div className="flex justify-center">
          <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-neutral-800 hover:text-neutral-900 font-semibold text-sm group transition-colors duration-200"
          >
            Visit Website
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
          </a>
        </div>
      </div>

      {/* Bottom Gradient Accent */}
      <div className={`h-1 w-full bg-gradient-to-r ${cardTheme.gradient}`} />
    </motion.div>
  );
}
