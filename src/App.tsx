import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HRDashboard from "./pages/HRDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import AdvanceRequestFlow from "./pages/AdvanceRequestFlow";
import SplashPage from "./pages/SplashPage";
import EligibilityCheck from "./pages/EligibilityCheck";
import RequestStatus from "./pages/RequestStatus";
import ActiveLoanDetail from "./pages/ActiveLoanDetail";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/eligibility" element={<EligibilityCheck />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/advance-request" element={<AdvanceRequestFlow />} />
          <Route path="/request-status" element={<RequestStatus />} />
          <Route path="/advance/:id" element={<ActiveLoanDetail />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/hr" element={<HRDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
