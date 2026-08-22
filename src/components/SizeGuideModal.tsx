import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SIZE_CHART_DATA } from '../data/categories';
import { X, Ruler, HelpCircle, Footprints, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide, activeSizeGuideTab, openSizeGuide } = useShop();
  const [footLengthInput, setFootLengthInput] = useState<string>('26.5');
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  if (!isSizeGuideOpen) return null;

  const currentChart = SIZE_CHART_DATA[activeSizeGuideTab];

  // Calculate recommended size
  const parsedLength = parseFloat(footLengthInput) || 0;
  const lengthInCm = unit === 'inches' ? parsedLength * 2.54 : parsedLength;
  const closestMatch = currentChart.reduce((prev, curr) => {
    return Math.abs(curr.cm - lengthInCm) < Math.abs(prev.cm - lengthInCm) ? curr : prev;
  }, currentChart[0]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200"
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-neutral-100 text-neutral-800">
                <Ruler className="w-5 h-5 text-neutral-800" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Footwear Sizing & Fit Guide</h3>
                <p className="text-xs text-neutral-500">Universal EU, US & UK size conversions</p>
              </div>
            </div>
            <button
              onClick={closeSizeGuide}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Gender Toggle Tabs */}
            <div className="flex bg-neutral-100 p-1 rounded-xl">
              <button
                onClick={() => openSizeGuide('men')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeSizeGuideTab === 'men'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Men's Sizing Chart
              </button>
              <button
                onClick={() => openSizeGuide('women')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeSizeGuideTab === 'women'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Women's Sizing Chart
              </button>
            </div>

            {/* Interactive Size Calculator */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="flex items-center gap-2 mb-2.5">
                <Footprints className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-neutral-900">Interactive Foot Length Finder</h4>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                    Enter your bare foot length ({unit}):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={footLengthInput}
                      onChange={(e) => setFootLengthInput(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                    <div className="flex bg-neutral-200 rounded-lg p-0.5 shrink-0">
                      <button
                        onClick={() => setUnit('cm')}
                        className={`px-2.5 py-1 text-xs font-bold rounded ${
                          unit === 'cm' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                        }`}
                      >
                        CM
                      </button>
                      <button
                        onClick={() => setUnit('inches')}
                        className={`px-2.5 py-1 text-xs font-bold rounded ${
                          unit === 'inches' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                        }`}
                      >
                        IN
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Recommended Fit
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl font-black text-neutral-900">EU {closestMatch.eu}</span>
                      <span className="text-xs font-medium text-neutral-500">
                        (US {closestMatch.us} / UK {closestMatch.uk})
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Table */}
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">EU Size</th>
                    <th className="px-4 py-3">US Size</th>
                    <th className="px-4 py-3">UK Size</th>
                    <th className="px-4 py-3">Foot Length (CM)</th>
                    <th className="px-4 py-3">Inches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {currentChart.map((row) => {
                    const isSelected = row.eu === closestMatch.eu;
                    return (
                      <tr
                        key={row.eu}
                        className={`transition-colors ${
                          isSelected ? 'bg-amber-50 font-bold text-neutral-900' : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1.5">
                            {row.eu}
                            {isSelected && (
                              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                                Matched
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">{row.us}</td>
                        <td className="px-4 py-2.5">{row.uk}</td>
                        <td className="px-4 py-2.5">{row.cm} cm</td>
                        <td className="px-4 py-2.5">{row.inches}"</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* How to Measure Instructions */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-neutral-700" />
                How to Measure Your Foot at Home:
              </div>
              <ol className="text-xs text-neutral-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Place a sheet of paper on a flat hard floor against a wall.</li>
                <li>Stand on the paper with your heel lightly touching the wall.</li>
                <li>Mark the furthest point of your longest toe with a pencil.</li>
                <li>Measure the distance from the edge of the paper to the mark in centimeters.</li>
              </ol>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-neutral-100 border-t border-neutral-200 flex justify-end">
            <button
              onClick={closeSizeGuide}
              className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Done & Return to Shopping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
