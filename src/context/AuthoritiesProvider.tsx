import { getAuthorities } from "@/services/permission-service/permission-service";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthoritiesContextProp {
  children: ReactNode;
}

interface AuthoritiesContextValue {
  authoritiesList: string[];
  setAuthoritiesList: (authoritiesList: string[]) => void;
  isLoading: boolean; // Add loading state
}

export const AuthoritiesContext = createContext<AuthoritiesContextValue>({
  authoritiesList: [],
  setAuthoritiesList: () => {},
  isLoading: true, // Default to loading
});

export const AuthoritiesProvider: React.FC<AuthoritiesContextProp> = ({
  children,
}) => {
  const [authoritiesList, setAuthoritiesList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        setIsLoading(true); // Set loading to true when starting fetch
        const res = await getAuthorities();
        setAuthoritiesList(res.authorities);
      } catch (error) {
        console.error("Error fetching authorities:", error);
        // Even on error, we should stop loading to prevent infinite loading
        setAuthoritiesList([]);
      } finally {
        setIsLoading(false); // Always set loading to false when done
      }
    };

    // Only fetch if user is logged in
    const isLoggedIn = localStorage.getItem("accessToken") !== null;
    if (isLoggedIn) {
      fetchAuthorities();
    } else {
      setIsLoading(false); // Not logged in, no need to load
    }
  }, []);

  useEffect(() => {
    console.log("Authorities List:", authoritiesList);
  }, [authoritiesList]);

  return (
    <AuthoritiesContext.Provider
      value={{ authoritiesList, setAuthoritiesList, isLoading }}
    >
      {children}
    </AuthoritiesContext.Provider>
  );
};
