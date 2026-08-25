import React, { useState } from 'react';
import { FAQ_LIST, STORE_LOCATIONS } from '../data/categories';
import { useShop } from '../context/ShopContext';
import {
  HelpCircle,
  MapPin,
  Mail,
  Phone,
  Send,
  ChevronDown,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ContactFaqPage: React.FC = () => {
  const { showToast, navigateTo } = useShop();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('all');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSent, setFormSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setFormSent(true);
    showToast('Message Received', 'Our footwear concierge will reply to you within 2 hours.', 'success');
  };

  const faqCategories = ['all', 'Sizing & Fit', 'Shipping & Delivery', 'Materials & Care', 'Returns & Warranty'];

  const filteredFaqs = FAQ_LIST.filter(
    (item) => activeFaqCategory === 'all' || item.category === activeFaqCategory
  );

  return (
    <div id="contact-faq-view" className="bg-neutral-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-neutral-800 text-xs font-bold uppercase tracking-wider border border-neutral-200 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-600" />
            Support Center & Flagships
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            How Can We Assist You Today?
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Find instant answers to sizing, deliveries, and care or reach our 24/7 dedicated concierge.
          </p>
        </div>

        {/* 1. Interactive FAQ Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-900">Frequently Asked Questions</h2>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFaqCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeFaqCategory === cat
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat === 'all' ? 'All Questions' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-bold text-neutral-900 group"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-neutral-900' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 leading-relaxed pl-2 border-l-2 border-neutral-900">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Flagship Stores & Contact Form 2-Col */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Flagship Locations (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Global Presence
                </span>
                <h3 className="text-xl font-bold text-neutral-900 mt-0.5">
                  Visit Our Flagship Boutiques
                </h3>
              </div>

              <div className="space-y-4 divide-y divide-neutral-100">
                {STORE_LOCATIONS.map((loc, i) => (
                  <div key={i} className={i > 0 ? 'pt-4' : ''}>
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-600" /> {loc.city}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1">{loc.address}</p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      <b>Timings:</b> {loc.hours}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Concierge Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Concierge Desk
                </span>
                <h3 className="text-xl font-bold text-neutral-900 mt-0.5">
                  Send Us a Direct Message
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Have a question regarding custom sizing, wedding party fittings, or special orders?
                </p>
              </div>

              {!formSent ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Full Name (Alphabets only)</label>
                      <input
                        type="text"
                        required
                        placeholder="Sophia Laurent"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="sophia@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Inquiry Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Sizing recommendation for Monza Loafers"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your question or request here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Send to Concierge
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Message Received!</h4>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Thank you {contactName}. A senior footwear specialist has been assigned to your ticket and will email you at {contactEmail}.
                  </p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="px-4 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-lg mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
