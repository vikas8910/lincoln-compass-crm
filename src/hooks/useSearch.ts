import { useState, useEffect, useCallback, useRef } from "react";

interface UseSearchProps {
  delay?: number;
  onSearch?: (searchTerm: string) => void;
  initialSearch?: string;
}

export default function useSearch({
  delay = 600,
  onSearch,
  initialSearch = "",
}: UseSearchProps = {}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  // Ref to hold the latest onSearch function
  const onSearchRef = useRef(onSearch);

  // Update the ref if onSearch changes
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  // Trigger the onSearch callback only when the debounced term changes
  useEffect(() => {
    if (onSearchRef.current) {
      onSearchRef.current(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearchChange,
    setSearchTerm,
  };
}
