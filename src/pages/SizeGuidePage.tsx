import React, { useState } from 'react';
import { SIZE_CHART_DATA } from '../data/categories';
import { useShop } from '../context/ShopContext';
import { Ruler, Sparkles, Footprints, CheckCircle2, ArrowRight } from 'lucide-react';

export const SizeGuidePage: React.FC = () => {
  const { navigateTo } = useShop();
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [footLengthCm, setFootLengthCm] = useState<string>('27.0');

  const chartData = gender === 'men' ? SIZE_CHART_DATA.men : SIZE_CHART_DATA.women;

  // Find closest size recommendation based on foot length
  const recommendedSize = chartData.reduce((prev, curr) => {
    return Math.abs(curr.cm - parseFloat(footLengthCm || '27')) < Math.abs(prev.cm - parseFloat(footLengthCm || '27'))
      ? curr
      : prev;
  }, chartData[0]);

  return (
    <div id="size-guide-full-page" className="bg-neutral-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-neutral-800 text-xs font-bold uppercase tracking-wider border border-neutral-200 shadow-xs">
            <Ruler className="w-3.5 h-3.5 text-neutral-600" />
            Precision Fit Master Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Footwear Size Conversion & Fit Calculator
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Never guess your shoe size again. Convert between EU, US, UK and CM measurements with millimeter accuracy.
          </p>
        </div>

        {/* Interactive Fit Calculator Card */}
        <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Interactive Smart Calculator
              </span>
              <h3 className="text-lg sm:text-xl font-bold">Find Your Exact SolePoint Size</h3>
            </div>

            {/* Gender Toggle */}
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
              <button
                onClick={() => setGender('men')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  gender === 'men' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Men's Sizing
              </button>
              <button
                onClick={() => setGender('women')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  gender === 'women' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Women's Sizing
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-300">
                Enter your foot length in Centimeters (CM) or Inches:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.5"
                  min="21"
                  max="33"
                  value={footLengthCm}
                  onChange={(e) => setFootLengthCm(e.target.value)}
                  className="w-32 px-4 py-2.5 bg-neutral-950 border border-neutral-700 text-white rounded-xl font-mono text-sm focus:outline-none focus:border-amber-400"
                />
                <span className="text-sm font-bold text-neutral-400">CM (~{(parseFloat(footLengthCm || '27') / 2.54).toFixed(1)} inches)</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Tip: If you are between two sizes, we recommend ordering the larger size for boots/runners and your exact size for loafers.
              </p>
            </div>

            {/* Recommendation Display */}
            {recommendedSize && (
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Recommended Fit
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      EU {recommendedSize.eu}
                    </span>
                    <span className="text-xs text-neutral-400">
                      (US {recommendedSize.us} • UK {recommendedSize.uk})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('shop')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                >
                  Shop Size EU {recommendedSize.eu} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conversion Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-neutral-900">
            {gender === 'men' ? "Men's" : "Women's"} Complete Conversion Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100/70 text-neutral-900 font-black border-b border-neutral-200">
                  <th className="py-3 px-4 rounded-l-xl">EU Size</th>
                  <th className="py-3 px-4">US Size</th>
                  <th className="py-3 px-4">UK Size</th>
                  <th className="py-3 px-4">Foot Length (CM)</th>
                  <th className="py-3 px-4 rounded-r-xl">Foot Length (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {chartData.map((row) => {
                  const isHighlighted = recommendedSize?.eu === row.eu;
                  return (
                    <tr
                      key={row.eu}
                      className={`hover:bg-neutral-50 transition-colors ${
                        isHighlighted ? 'bg-amber-50/70 font-bold text-neutral-900' : 'text-neutral-700'
                      }`}
                    >
                      <td className="py-3 px-4 font-black">EU {row.eu}</td>
                      <td className="py-3 px-4">US {row.us}</td>
                      <td className="py-3 px-4">UK {row.uk}</td>
                      <td className="py-3 px-4 font-mono">{row.cm} cm</td>
                      <td className="py-3 px-4 font-mono">{row.inches}"</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Step Foot Measuring Guide */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-neutral-900">How to Measure Your Feet at Home</h3>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-neutral-900">Step on Paper</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Place a piece of blank A4 paper on a hard floor flush against a flat wall. Step on the paper with your heel lightly touching the wall.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-neutral-900">Mark the Longest Point</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Use a pencil held perpendicular to mark the furthest tip of your longest toe (usually the big toe or second toe).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-neutral-900">Measure Distance</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Use a ruler to measure the distance in centimeters from the edge of the paper to your mark, then plug it into our smart calculator above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
