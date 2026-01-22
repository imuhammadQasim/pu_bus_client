import { useState, useEffect } from 'react';

export function useReverseGeocoding(lat: number | undefined, lng: number | undefined) {
  const [address, setAddress] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === undefined || lng === undefined) {
      setAddress(null);
      return;
    }

    const fetchAddress = async () => {
      setIsGeocoding(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en'
            }
          }
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        console.log('Nominatim response:', data);
        
        if (!data || !data.address) {
          setAddress(data?.display_name || null);
          return;
        }

        const addr = data.address;
        const mainPart = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || addr.city || '';
        const secondaryPart = addr.suburb || addr.city || addr.district || '';
        
        const displayName = mainPart && secondaryPart && mainPart !== secondaryPart 
          ? `${mainPart}, ${secondaryPart}`
          : mainPart || secondaryPart || data.display_name || 'Unknown Location';

        console.log('Extracted address:', displayName);
        setAddress(displayName);
      } catch (err) {
        console.error('Reverse geocoding error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setAddress(null); // Fallback to Sidebar's default (coords)
      } finally {
        setIsGeocoding(false);
      }
    };

    // Small delay to debounce rapid position updates and avoid rate limits
    const timer = setTimeout(fetchAddress, 1500);
    return () => clearTimeout(timer);
  }, [lat, lng]);

  return { address, isGeocoding, error };
}
