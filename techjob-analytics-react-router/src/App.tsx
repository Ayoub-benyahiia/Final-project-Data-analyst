import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import DashboardLayout from "@/pages/DashboardLayout";
import MarketOverviewPage from "@/modules/dashboard/pages/MarketOverviewPage";
import DetailedAnalysisPage from "@/modules/dashboard/pages/DetailedAnalysisPage";
import StackMatcherPage from "@/modules/dashboard/pages/StackMatcherPage";
import SkillPairingsPage from "@/modules/dashboard/pages/SkillPairingsPage";
import SkillsCatalogPage from "@/modules/dashboard/pages/SkillsCatalogPage";

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
