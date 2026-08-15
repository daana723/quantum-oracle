import { lazy, Suspense } from "react";
import InstallBanner from "@/components/oracle/InstallBanner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const CardGallery = lazy(() => import("./pages/CardGallery"));
const CardDetail = lazy(() => import("./pages/CardDetail"));
const Install = lazy(() => import("./pages/Install"));
const DailyOracle = lazy(() => import("./pages/DailyOracle"));
const PatternAnalytics = lazy(() => import("./pages/PatternAnalytics"));
const BirthChart = lazy(() => import("./pages/BirthChart"));
const RitualCalendar = lazy(() => import("./pages/RitualCalendar"));
const LunarCalendar = lazy(() => import("./pages/LunarCalendar"));
const MinorArcanaGallery = lazy(() => import("./pages/MinorArcanaGallery"));

const queryClient = new QueryClient();

// Desktop (Electron) builds load from file:// where history routing can't work
const Router = import.meta.env.VITE_DESKTOP === "true" ? HashRouter : BrowserRouter;

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/daily" element={<DailyOracle />} />
              <Route path="/gallery" element={<CardGallery />} />
              <Route path="/cards/:slug" element={<CardDetail />} />
              <Route path="/patterns" element={<PatternAnalytics />} />
              <Route path="/birth-chart" element={<BirthChart />} />
              <Route path="/lunar-calendar" element={<LunarCalendar />} />
              <Route path="/rituals" element={<RitualCalendar />} />
              <Route path="/install" element={<Install />} />
              <Route path="/vault-minor" element={<MinorArcanaGallery />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <InstallBanner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
