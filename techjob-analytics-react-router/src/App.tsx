import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy-loaded route components
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const DashboardLayout = lazy(() => import("@/pages/DashboardLayout"));
const MarketOverviewPage = lazy(() => import("@/modules/dashboard/pages/MarketOverviewPage"));
const DetailedAnalysisPage = lazy(() => import("@/modules/dashboard/pages/DetailedAnalysisPage"));
const StackMatcherPage = lazy(() => import("@/modules/dashboard/pages/StackMatcherPage"));
const SkillPairingsPage = lazy(() => import("@/modules/dashboard/pages/SkillPairingsPage"));
const SkillsCatalogPage = lazy(() => import("@/modules/dashboard/pages/SkillsCatalogPage"));

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f6f3f1] font-mono">
      <div className="flex flex-col items-center gap-3 rounded-[28px] sm:rounded-[40px] border border-[#cecac8] bg-white/70 backdrop-blur-xs px-8 py-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#2b59d1] animate-ping" />
          <span className="font-serif text-lg font-normal text-[#242424] tracking-[-0.02em]">
            TechJob <span className="text-[#767270]">Analytics</span>
          </span>
        </div>
        <p className="text-[11px] font-mono text-[#767270] tracking-wider uppercase">
          Loading module…
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<MarketOverviewPage />} />
            <Route path="analysis" element={<DetailedAnalysisPage />} />
            <Route path="matcher" element={<StackMatcherPage />} />
            <Route path="skills/pairings" element={<SkillPairingsPage />} />
            <Route path="skills/catalog" element={<SkillsCatalogPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
