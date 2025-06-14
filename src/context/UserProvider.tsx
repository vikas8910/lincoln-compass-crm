import { getCurrentUser } from "@/services/user-service/user-service";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// User interface based on your login data structure
interface User {
  id: number;
  email: string;
  name: string;
  contactNumber: string;
  status: string;
  roles: any[];
  createdAt: string;
  updatedAt: string;
}

// Context value interface
interface UserContextValue {
  user: User | null;
  setUser: (userData: User | null) => void;
}

// Create the context
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Props for the provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const contextValue: UserContextValue = {
    user,
    setUser,
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await getCurrentUser();
      setUser(res);
    };
    const isLoggedIn = localStorage.getItem("accessToken") !== null;
    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, []);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Export types for use in other components
export type { User, UserContextValue };
