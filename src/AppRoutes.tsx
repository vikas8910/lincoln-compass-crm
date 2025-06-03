import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Leads from "./pages/dashboard/Leads";
import RolesPermissions from "./pages/dashboard/RolesPermissions";
import SalesOfficerRoles from "./pages/dashboard/SalesOfficerRoles";
import LeadDetails from "./pages/lead/LeadDetails";
import { LeadsProvider } from "./context/LeadsProvider";
import Permissions from "./pages/dashboard/Permissions";
import { useAuthoritiesList } from "./hooks/useAuthoritiesList";
import { PermissionsEnum } from "./lib/constants";
import NotHavingPermissions from "./pages/NotHavingPermissions";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

const AppRoutes = () => {
  const { authoritiesList, isLoading } = useAuthoritiesList();
  console.log("Authorities List:", authoritiesList);

  const isLoggedIn = (): boolean => {
    return localStorage.getItem("accessToken") !== null;
  };

  const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    return isLoggedIn() ? element : <Navigate to="/login" />;
  };

  // Determine default landing page based on authorities
  const getDefaultRoute = () => {
    if (authoritiesList.length === 0) {
      return "/no-permissions";
    }

    // Check if user has manage roles permission
    if (authoritiesList.includes(PermissionsEnum.MANAGE_ROLES)) {
      return "/dashboard";
    }

    // Check if user has any leads-related permissions
    const hasLeadsPermissions = authoritiesList.some((authority) =>
      authority.startsWith("leads:")
    );

    if (hasLeadsPermissions) {
      return "/leads";
    }

    // If no specific permissions found, redirect to no-permissions
    return "/no-permissions";
  };

  // Show loading spinner while authorities are being fetched
  if (isLoading && isLoggedIn()) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {authoritiesList.length === 0 && (
          <Route
            path="/no-permissions"
            element={<ProtectedRoute element={<NotHavingPermissions />} />}
          />
        )}

        {authoritiesList.some((authority) =>
          authority.startsWith("leads:")
        ) && (
          <>
            <Route
              path="/leads"
              element={<ProtectedRoute element={<Leads />} />}
            />
            <Route
              path="/lead-details/:leadId"
              element={
                <ProtectedRoute
                  element={
                    <LeadsProvider initialStatusId="1">
                      <LeadDetails />
                    </LeadsProvider>
                  }
                />
              }
            />
          </>
        )}

        <Route
          path="/dashboard"
          element={
            authoritiesList.includes(PermissionsEnum.MANAGE_ROLES) ? (
              <ProtectedRoute element={<Dashboard />} />
            ) : (
              <Navigate to={getDefaultRoute()} replace />
            )
          }
        />

        {authoritiesList.includes(PermissionsEnum.MANAGE_ROLES) && (
          <>
            <Route
              path="/roles"
              element={<ProtectedRoute element={<RolesPermissions />} />}
            />
            <Route
              path="/permissions"
              element={<ProtectedRoute element={<Permissions />} />}
            />
          </>
        )}

        {authoritiesList.includes(PermissionsEnum.MANAGE_USERS) && (
          <Route
            path="/sales-officer-roles"
            element={<ProtectedRoute element={<SalesOfficerRoles />} />}
          />
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
