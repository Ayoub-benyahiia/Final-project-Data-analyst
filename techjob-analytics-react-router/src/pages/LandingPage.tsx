"use client";

import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, BarChart3, Zap, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

const personas = [
  {
    title: "For Job Seekers",
    description: "Understand market demand, identify high-ROI skills, and find the best cities for your stack.",
    icon: Zap,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "For Recruiters",
    description: "Benchmark salaries, analyze competitor hiring patterns, and identify talent hotspots.",
    icon: BarChart3,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    title: "For Educators",
    description: "Align curricula with market needs. See which technologies employers actually demand.",
    icon: Globe,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const faqs = [
  {
    question: "What data sources power TechJob Analytics?",
    answer: "We aggregate and normalize data from major Moroccan job boards, company career pages, and recruitment platforms. Our dataset covers 10,782+ normalized job postings across the Moroccan IT market.",
  },
  {
    question: "How often is the data updated?",
    answer: "Our pipeline runs daily, ensuring you always have access to the latest market trends, tech ecosystem insights, and skill demand evolution.",
  },
  {
    question: "Can I filter by city or contract type?",
    answer: "Absolutely. Our dashboard features 5 URL-synced multi-select filters: City, Contract, Education, Experience, and Technology. Share filtered views with your team via URL.",
  },
  {
    question: "Is there a free tier?",
    answer: "Yes. The Market Overview dashboard is completely free. Advanced features like Stack Matcher and Skill Pairings are available in our Pro plan.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      navigate("/dashboard");
      return;
    }
    navigate(`/dashboard?technology=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <BarChart3 className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-medium text-slate-900">TechJob Analytics</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">Features</a>
            <a href="#personas" className="text-sm text-slate-600 hover:text-slate-900">Use Cases</a>
            <a href="#faq" className="text-sm text-slate-600 hover:text-slate-900">FAQ</a>
            <Link
              to="/dashboard"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50 pt-20 pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="animate-[slideUp_0.5s_ease-out]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-[13px] font-medium text-indigo-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                10,782 jobs analyzed across Morocco
              </div>
              <h1 className="mb-5 text-5xl font-medium leading-tight tracking-tight text-slate-900">
                Decode the Moroccan{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  IT Job Market
                </span>
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-slate-600">
                Real-time analytics on salaries, skills, and hiring trends. Make data-driven career and recruitment decisions.
              </p>

              <form onSubmit={handleSearch} className="relative mb-6 max-w-md">
                <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search technology, city, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-28 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-indigo-700 active:scale-95"
                >
                  Search
                </button>
              </form>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-9 rounded-full border-2 border-white"
                      style={{ backgroundColor: `hsl(${220 + i * 15}, 70%, ${80 - i * 5}%)` }}
                    />
                  ))}
                </div>
                <p className="text-[13px] text-slate-500">
                  Trusted by <strong className="text-slate-900">1,200+</strong> developers & recruiters
                </p>
              </div>
            </div>

            <div className="relative" style={{ perspective: "1400px" }}>
              <div
                className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
                style={{ transform: "rotateX(5deg) rotateY(-3deg) rotateZ(1deg)" }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="rounded-lg bg-slate-50 p-3">
                        <div className="mb-2 h-2 w-10 rounded bg-slate-200" />
                        <div className="h-6 w-14 rounded bg-indigo-100" />
                      </div>
                    ))}
                  </div>
                  <div className="h-40 rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-lg bg-slate-50" />
                    <div className="h-24 rounded-lg bg-slate-50" />
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 -top-6 rounded-xl border border-slate-100 bg-white p-3 shadow-lg animate-[fadeIn_0.6s_ease-out]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <Zap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Match Score</div>
                    <div className="text-base font-medium text-slate-900">87%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Analyzing data from leading Moroccan companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-50 grayscale">
            {["OCP", "Maroc Telecom", "Attijariwafa", "Royal Air Maroc", "Capgemini", "Atos"].map((company) => (
              <span key={company} className="text-base font-semibold text-slate-600">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Persona Cards */}
      <section id="personas" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-medium text-slate-900">Built for every stakeholder</h2>
            <p className="text-base text-slate-500">Whether you're hunting for jobs, hiring talent, or shaping curricula.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {personas.map((persona) => {
              const Icon = persona.icon;
              return (
                <div
                  key={persona.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${persona.bg}`}>
                    <Icon className={`h-6 w-6 ${persona.color}`} />
                  </div>
                  <h3 className="mb-3 text-xl font-medium text-slate-900">{persona.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-slate-500">{persona.description}</p>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-all group-hover:gap-2.5"
                  >
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50/50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-medium text-slate-900">Frequently Asked Questions</h2>
            <p className="text-base text-slate-500">Everything you need to know about TechJob Analytics.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="text-[15px] font-medium text-slate-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-4.5 w-4.5 text-slate-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                  <BarChart3 className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-base font-medium text-slate-900">TechJob Analytics</span>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-500">
                Data-driven insights for the Moroccan IT job market. Make smarter career and hiring decisions.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Product</h4>
              <ul className="space-y-2">
                {["Market Overview", "Detailed Analysis", "Stack Matcher", "Skill Pairings"].map((item) => (
                  <li key={item}>
                    <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Resources</h4>
              <ul className="space-y-2">
                {["Documentation", "API Reference", "Blog", "Changelog"].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Legal</h4>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-100 pt-6 text-center text-[13px] text-slate-400">
            © 2026 TechJob Analytics. All rights reserved. Made with data for Morocco.
          </div>
        </div>
      </footer>
    </div>
  );
}
