import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">
                TJ
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                TechJob<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Analytics</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-normal">
              Plateforme d'intelligence et d'analytique prédictive sur le marché du travail IT et tech au Maroc.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-md inline-block">
                ● In-Memory DuckDB OLAP Engine (&lt;15ms)
              </span>
            </div>
          </div>

          {/* Column 2: Platform (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Plateforme
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Market Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard/analysis" className="hover:text-white transition-colors">
                  Analyse Détaillée
                </Link>
              </li>
              <li>
                <Link to="/dashboard/matcher" className="hover:text-white transition-colors">
                  Stack Matcher
                </Link>
              </li>
              <li>
                <Link to="/dashboard/skills/pairings" className="hover:text-white transition-colors">
                  Skill Pairings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Ressources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="/api/v1/market-pulse" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  API Endpoints
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  PFE Thesis Docs
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company / PFE (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Projet & Auteur
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Projet de Fin d'Études (PFE) Master Big Data & Analytics. Architecture Big Data basée sur 13 tables Parquet normalisées.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="mailto:contact@techjob-analytics.ma"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Mail"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <p>© {new Date().getFullYear()} TechJob Analytics Morocco. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-slate-400 transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/dashboard" className="hover:text-slate-400 transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
