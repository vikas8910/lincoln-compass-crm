
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
import LeadDetailsEnhanced from "./pages/dashboard/LeadDetailsEnhanced";
import LeadPipeline from "./pages/dashboard/LeadPipeline";
import RolesPermissions from "./pages/dashboard/RolesPermissions";
import RolesUsers from "./pages/dashboard/RolesUsers";
import LeadAssignment from "./pages/dashboard/LeadAssignment";
import SalesOfficerRoles from "./pages/dashboard/SalesOfficerRoles";

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
            <Route path="/leads/:leadId" element={<ProtectedRoute element={<LeadDetailsEnhanced />} />} />
            <Route path="/lead-pipeline" element={<ProtectedRoute element={<LeadPipeline />} />} />
            <Route path="/roles-permissions" element={<ProtectedRoute element={<RolesPermissions />} />} />
            <Route path="/roles-users" element={<ProtectedRoute element={<RolesUsers />} />} />
            <Route path="/leads-mapping" element={<ProtectedRoute element={<LeadAssignment />} />} />
            <Route path="/user-role-management" element={<ProtectedRoute element={<SalesOfficerRoles />} />} />
            {/* Redirects for old routes */}
            <Route path="/sales-mapping" element={<ProtectedRoute element={<Navigate to="/leads-mapping" replace />} />} />
            <Route path="/lead-assignment" element={<ProtectedRoute element={<Navigate to="/leads-mapping" replace />} />} />
            <Route path="/sales-officer-roles" element={<ProtectedRoute element={<Navigate to="/user-role-management" replace />} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
