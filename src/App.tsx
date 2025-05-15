
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import SalesOfficers from "./pages/dashboard/SalesOfficers";
import Leads from "./pages/dashboard/Leads";
import LeadDetails from "./pages/dashboard/LeadDetails";
import LeadPipeline from "./pages/dashboard/LeadPipeline";
import RolesPermissions from "./pages/dashboard/RolesPermissions";
import LeadAssignment from "./pages/dashboard/LeadAssignment";

const queryClient = new QueryClient();

const App = () => {
  // Check if user is logged in - in a real app, this would use a more robust auth system
  const isLoggedIn = (): boolean => {
    return localStorage.getItem("user_type") !== null;
  };

  // Protected route component
  const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    return isLoggedIn() ? element : <Navigate to="/login" />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/sales-officers" element={<ProtectedRoute element={<SalesOfficers />} />} />
            <Route path="/sales-officers/:officerId" element={<ProtectedRoute element={<div>Sales Officer Details Page - To be implemented</div>} />} />
            <Route path="/leads" element={<ProtectedRoute element={<Leads />} />} />
            <Route path="/leads/:leadId" element={<ProtectedRoute element={<LeadDetails />} />} />
            <Route path="/lead-pipeline" element={<ProtectedRoute element={<LeadPipeline />} />} />
            <Route path="/roles-permissions" element={<ProtectedRoute element={<RolesPermissions />} />} />
            <Route path="/lead-assignment" element={<ProtectedRoute element={<LeadAssignment />} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
