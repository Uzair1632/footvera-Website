import React from 'react';
import { useShop } from '../context/ShopContext';
import { Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div id="about-brand-view" className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            Pakistani Artisanal Footwear Heritage
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
            Crafting Heritage Footwear for Pakistan & the World
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            SolePoint (Shoe Point Pakistan) unites generations of traditional Peshawari master ustads and Lahore cobbler lineages with cutting-edge orthopedic comfort soles and modern footwear design.
          </p>
        </div>

        {/* Story Grid Split 1: Leather Heritage */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 aspect-4/3">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80"
              alt="Traditional leather craftsmanship"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Peshawar & Lahore Artisans
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              100% Pure Full-Grain Cowhide Leather
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every Noruzi chappal, Kaptaan sandal, and formal Oxford shoe is made from premium vegetable-tanned hides sourced from ethical tanneries. Hand-stitched with reinforced wax threads, durable recycled tire rubber soles, and double-padded insoles for unmatched durability on every terrain.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hand-burnished by master ustads in Namak Mandi, Peshawar
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Authentic zari & tilla embroidery for bridal khussas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Breathable genuine leather lining that molds to your feet
              </li>
            </ul>
          </div>
        </div>

        {/* Story Grid Split 2: Contemporary Comfort */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 order-2 md:order-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Modern Performance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Dual-Density Orthopedic Insoles & NitroFoam
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Why should traditional footwear compromise on walking comfort? Our shoes feature dual-density arch supports and memory foam underlays so you can comfortably attend day-long Pakistani weddings, Friday prayers, and office meetings with zero heel fatigue.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-2xl font-black text-neutral-900 block">100%</span>
                <span className="text-xs text-neutral-500 font-medium">Authentic Pakistani Leather</span>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-2xl font-black text-neutral-900 block">7-Day</span>
                <span className="text-xs text-neutral-500 font-medium">Doorstep Size Exchange</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 aspect-4/3 order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80"
              alt="Contemporary shoe cushioning"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to Upgrade Your Footwear Collection?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Enjoy free delivery across Pakistan on orders above Rs. 4000 with Cash on Delivery and 7-day doorstep size replacement.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 bg-amber-400 text-neutral-950 hover:bg-amber-300 font-black text-xs rounded-xl inline-flex items-center gap-2 shadow-lg transition-all"
          >
            Explore Pakistani Catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
