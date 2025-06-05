import { AuthoritiesContext } from "@/context/AuthoritiesProvider";
import { useContext } from "react";

export const useAuthoritiesList = () => {
  const context = useContext(AuthoritiesContext);
  if (context === undefined) {
    throw new Error(
      "useAuthoritiesList must be used within a AuthoritiesProvider"
    );
  }
  return context;
};
