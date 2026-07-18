import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { faqs } from '../data';

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-28 px-6 max-w-4xl mx-auto border-t-4 border-zinc-950" id="faqs">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block mb-2 font-mono">Platform Mechanics</span>
        <h2 className="text-4xl font-serif font-black text-zinc-950 tracking-tight leading-none">
          Frequently Answered Queries
        </h2>
        <p className="text-zinc-800 font-bold mt-3 text-base">
          Everything you need to know about our indexing engine, Star Schema database, and accuracy validation pipelines.
        </p>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-4">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div 
              key={idx} 
              className={`overflow-hidden transition-all duration-300 border-bold rounded-lg ${
                isOpen ? 'bg-cream shadow-hard' : 'bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-hard-sm'
              }`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={`w-4.5 h-4.5 shrink-0 transition-colors ${isOpen ? 'text-rose-600' : 'text-zinc-800'}`} />
                  <span className="font-black text-zinc-950 text-sm md:text-base leading-tight font-serif">{faq.q}</span>
                </div>
                <ChevronDown className={`w-4.5 h-4.5 text-zinc-950 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rose-600' : ''}`} />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-3 text-sm text-zinc-900 font-semibold leading-relaxed border-t-2 border-zinc-950 pl-[42px]">
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Contact Block */}
      <div className="mt-14 text-center bg-sand border-bold rounded-lg p-6 max-w-xl mx-auto flex items-center justify-center gap-3.5 flex-wrap shadow-hard-sm animate-fade-in">
        <MessageSquare className="w-5 h-5 text-rose-600 shrink-0" />
        <span className="text-xs font-bold text-zinc-950">
          Have an advanced custom enterprise scraping request?
        </span>
        <a 
          href="mailto:ayouuubbeenyahya@gmail.com" 
          className="text-xs font-black text-rose-600 hover:underline inline-flex items-center gap-1 font-mono uppercase tracking-wider"
        >
          Contact Engineering &rarr;
        </a>
      </div>
    </section>
  );
}
