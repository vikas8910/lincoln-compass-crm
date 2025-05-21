
import { useState, useEffect, useCallback } from "react";

interface UseSearchProps {
  delay?: number;
  onSearch?: (searchTerm: string) => void;
  initialSearch?: string;
}

export default function useSearch({
  delay = 500,
  onSearch,
  initialSearch = "",
}: UseSearchProps = {}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  // Handle search term change with debounce
  useEffect(() => {
    // Only trigger debounce timer if searchTerm changes
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  // Separate effect to handle the actual search
  useEffect(() => {
    // Only call onSearch if there's actually a search handler and debouncedSearchTerm has changed
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

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
