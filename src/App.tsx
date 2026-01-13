import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Report from "./pages/Report";
import Reports from "./pages/Reports";
import About from "./pages/About";
import Disclaimer from "./pages/Disclaimer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ReportsList from "./pages/admin/ReportsList";
import CreateReport from "./pages/admin/CreateReport";
import EditReport from "./pages/admin/EditReport";
import AIGenerateReport from "./pages/admin/AIGenerateReport";
import Categories from "./pages/admin/Categories";
import Analytics from "./pages/admin/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/report/:slug" element={<Report />} />
            <Route path="/about" element={<About />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="reports" element={<ReportsList />} />
              <Route path="reports/new" element={<CreateReport />} />
              <Route path="reports/:id/edit" element={<EditReport />} />
              <Route path="reports/ai" element={<AIGenerateReport />} />
              <Route path="categories" element={<Categories />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
