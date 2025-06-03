import { createContext, ReactNode, useState } from "react";

interface AuthoritiesContextProp {
  children: ReactNode;
}

interface AuthoritiesContextValue {
  authoritiesList: string[];
  setAuthoritiesList: (authoritiesList: string[]) => void;
}

export const AuthoritiesContext = createContext<AuthoritiesContextValue>({
  authoritiesList: [],
  setAuthoritiesList: () => {},
});

const AuthoritiesProvider: React.FC<AuthoritiesContextProp> = ({
  children,
}) => {
  const [authoritiesList, setAuthoritiesList] = useState<string[]>([]);
  return (
    <AuthoritiesContext.Provider
      value={{ authoritiesList, setAuthoritiesList }}
    >
      {children}
    </AuthoritiesContext.Provider>
  );
};

export default AuthoritiesProvider;
