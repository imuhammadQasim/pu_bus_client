import { useState, useEffect } from 'react';

interface SearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query + ", Lahore"
          )}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Suggestions error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const search = async (searchQuery?: string): Promise<SearchResult | null> => {
    const q = searchQuery || query;
    if (!q.trim()) return null;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q + ", Lahore, Pakistan"
        )}&limit=1`
      );
      const data = await response.json();
      return data[0] || null;
    } catch (error) {
      console.error("Search error:", error);
      return null;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
  };

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    search,
    clearSearch,
  };
}
