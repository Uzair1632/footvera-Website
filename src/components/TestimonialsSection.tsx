import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      author: 'Marcus Vance',
      role: 'Architect & Marathoner',
      shoe: 'AeroGlide Elite Runner',
      rating: 5,
      fit: 'True to Size',
      text: 'I average 12,000 steps daily on hard concrete building sites and office floors. The nitrogen midsole rebound in the AeroGlide gives unmatched joint relief without looking like a bulky orthopedic trainer.',
    },
    {
      id: 2,
      author: 'Elena Rostova',
      role: 'Creative Director',
      shoe: 'Aria Stiletto Sculpted Pump',
      rating: 5,
      fit: 'True to Size',
      text: 'I have never been able to stand in pointed pumps for an entire 6-hour gala until now. The concealed metatarsal cushion completely eliminates ball-of-foot pressure. Absolutely magnificent craftsmanship.',
    },
    {
      id: 3,
      author: 'Julian Sterling',
      role: 'Groom & Attorney',
      shoe: 'Monza Hand-Burnished Loafer',
      rating: 5,
      fit: 'True to Size',
      text: 'Wore these right out of the box for my wedding weekend in Tuscany. Zero break-in blisters. The antique cognac patina under direct sunlight looked like a $600 bespoke pair.',
    },
  ];

  return (
    <section id="customer-reviews-section" className="py-14 sm:py-20 bg-neutral-50/80 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Verified Wearers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight">
            Tested in Real Life, Loved Globally
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1 text-sm font-black text-neutral-800">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span>4.9 / 5.0 Average Rating across 14,000+ Customers</span>
          </div>
        </div>

        {/* Cards Grid with Staggered Motion */}
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-neutral-100 absolute top-6 right-6 pointer-events-none" />

              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic mb-4">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-neutral-950 flex items-center gap-1.5">
                      {rev.author}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Buyer" />
                    </h4>
                    <span className="text-xs text-neutral-500 font-medium">{rev.role}</span>
                  </div>

                  <span className="text-[11px] font-black px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                    Fit: {rev.fit}
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-neutral-400 font-medium truncate">
                  Purchased: <span className="text-neutral-900 font-bold">{rev.shoe}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
