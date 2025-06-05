import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./AppRoutes";
import { AuthoritiesProvider } from "./context/AuthoritiesProvider";
import { UserProvider } from "./context/UserProvider";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster /> {/* From @/components/ui/toaster - radix-ui toast */}
        <Sonner /> {/* From @/components/ui/sonner - sonner toast */}
        <AuthoritiesProvider>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </AuthoritiesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
