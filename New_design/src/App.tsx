import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';

const DashboardOverview = lazy(() => import('./modules/overview/DashboardOverview'));
const DetailedAnalysis = lazy(() => import('./modules/analysis/DetailedAnalysis'));
const StackMatcherPage = lazy(() => import('./modules/matcher/StackMatcherPage'));
const PairingsExplorer = lazy(() => import('./modules/pairings/PairingsExplorer'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000, retry: 1 },
  },
});

function PageSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Suspense fallback={<PageSkeleton />}><DashboardOverview /></Suspense>} />
                <Route path="/dashboard/analysis" element={<Suspense fallback={<PageSkeleton />}><DetailedAnalysis /></Suspense>} />
                <Route path="/dashboard/matcher" element={<Suspense fallback={<PageSkeleton />}><StackMatcherPage /></Suspense>} />
                <Route path="/dashboard/skills/pairings" element={<Suspense fallback={<PageSkeleton />}><PairingsExplorer /></Suspense>} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
