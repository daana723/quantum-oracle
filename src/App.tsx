import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CardGallery from "./pages/CardGallery";
import CardDetail from "./pages/CardDetail";
import Install from "./pages/Install";
import DailyOracle from "./pages/DailyOracle";
import PatternAnalytics from "./pages/PatternAnalytics";
import BirthChart from "./pages/BirthChart";
import RitualCalendar from "./pages/RitualCalendar";
import LunarCalendar from "./pages/LunarCalendar";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
