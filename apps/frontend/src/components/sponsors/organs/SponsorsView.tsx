import { motion } from "framer-motion";
import { SponsorCard } from "./SponsorCard";
import { SponsorsPageSkeleton } from "./SponsorsSkeleton";
import { Sparkles, Award, Star } from "lucide-react";

export type Tier = "platinum" | "gold" | "silver" | "bronze";

export interface SponsorsViewProps {
  sponsors: Array<{
    id: string;
    name: string;
    logo: string;
    tier: Tier;
    description: string;
    website: string;
    featured?: boolean;
    active?: boolean;
    priority?: number;
  }>;
  loading: boolean;
  error: string | null;
  featuredSponsors: SponsorsViewProps["sponsors"];
}

export function SponsorsView(props: SponsorsViewProps) {
  const { sponsors, loading, error, featuredSponsors } = props;
  // Exclude featured from the smaller grid to avoid duplicates
  const nonFeatured = (sponsors || [])
    .filter((s) => !s.featured)
    .sort((a: any, b: any) => (a.priority ?? Infinity) - (b.priority ?? Infinity));

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-700/10" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Our Partners
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 bg-clip-text text-transparent">
              Meet Our Sponsors
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We&apos;re proud to partner with leading brands that share our
              vision of creating the ultimate fantasy cricket experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Sponsors */}
      {featuredSponsors.length > 0 && !loading && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">Featured Partners</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredSponsors.map((sponsor, index) => (
                  <motion.div
                    key={sponsor.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <SponsorCard sponsor={sponsor} featured />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filter Tabs removed - no tiers */}

      {/* All Sponsors Grid */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <SponsorsPageSkeleton />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {nonFeatured.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {nonFeatured
                    .sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity))
                    .map((sponsor, index) => (
                      <motion.div
                        key={sponsor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 * index }}
                      >
                        <SponsorCard sponsor={sponsor} />
                      </motion.div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No sponsors found in this tier.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Award className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">Become a Partner</h2>
            <p className="text-xl text-white/90 mb-8">
              Join our growing network of sponsors and reach millions of cricket enthusiasts worldwide.
            </p>
            <button className="bg-white text-primary-700 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Contact Us
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
