
import { useState, useEffect, useCallback } from "react";

interface UseSearchProps {
  delay?: number;
  onSearch?: (searchTerm: string) => void;
}

export default function useSearch({
  delay = 500,
  onSearch,
}: UseSearchProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  // Handle search term change with debounce
  useEffect(() => {
    // Only set up the debounce timer if searchTerm has a value or has changed from previous value
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, delay);

    // Clean up the timeout if searchTerm changes before the delay has passed
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay, onSearch]);

  // Handle search input change
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearchChange,
    setSearchTerm,
  };
}
