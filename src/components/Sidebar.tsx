import React, { useEffect, useState } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import {
  useOperatingStatus,
  OperatingStatus,
} from "@/hooks/useOperatingStatus";
import { Route, OPERATING_HOURS } from "@/data/routeData";
import { RouteCard } from "./RouteCard";
import { useSearch } from "@/hooks/useSearch";

import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";

interface SidebarProps {
  routes: Route[];
  activeRouteId: number | string | null;
  onRouteToggle: (routeId: number | string) => void;
  userLocation: { lat: number; lng: number } | null;
  onSearchSelect: (lat: number, lng: number, address: string) => void;
  operatingStatus: OperatingStatus;
}

export const Sidebar: React.FC<SidebarProps> = ({
  routes,
  activeRouteId,
  onRouteToggle,
  userLocation,
  onSearchSelect,
  operatingStatus,
}) => {
  const { query, setQuery, suggestions, isLoading, search, clearSearch } =
    useSearch();
  const { address, isGeocoding } = useReverseGeocoding(
    userLocation?.lat,
    userLocation?.lng,
  );
  
  const [sidebarHeight, setSidebarHeight] = useState("50vh");
  const handleSearch = async () => {
    const result = await search();
    if (result) {
      onSearchSelect(
        parseFloat(result.lat),
        parseFloat(result.lon),
        result.display_name,
      );
      clearSearch();
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    onSearchSelect(
      parseFloat(suggestion.lat),
      parseFloat(suggestion.lon),
      suggestion.display_name,
    );
    clearSearch();
  };

  const formatNextBatchTime = () => {
    if (!operatingStatus.nextBatch) return "--:--";

    const startTime = new Date();
    startTime.setHours(operatingStatus.nextBatch.batch.start, 0, 0, 0);
    
    if (operatingStatus.nextBatch.nextMonday) {
      // Find next Monday
      const day = startTime.getDay();
      const diff = day === 0 ? 1 : (8 - day);
      startTime.setDate(startTime.getDate() + diff);
      
      return `Mon, ${startTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    if (operatingStatus.nextBatch.tomorrow) {
      startTime.setDate(startTime.getDate() + 1);
    }

    return startTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-card flex flex-col shadow-xl z-[500] md:max-h-full max-h-[50vh] md:relative fixed bottom-0 left-0 right-0 rounded-t-xl md:rounded-none">
      {/* Mobile Drag Handle */}
      <div className="md:hidden w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto my-3 cursor-grab" />

      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search location in Lahore..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-border rounded-lg text-sm bg-background focus:outline-none focus:border-primary transition-colors"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, i) => {
                const parts = suggestion.display_name.split(", ");
                const shortName = parts.slice(0, 2).join(", ");
                return (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors border-b border-border last:border-b-0"
                  >
                    {shortName}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Location Info */}
        {userLocation && (
          <div className="flex items-center gap-3 p-2.5 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg mb-3">
            <div className="w-9 h-9 bg-white dark:bg-green-900 rounded-full flex items-center justify-center text-green-500">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-green-800 dark:text-green-200">
                Your Location
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 truncate">
                {isGeocoding ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Finding address...
                  </span>
                ) : (
                  address ||
                  (userLocation
                    ? `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
                    : "")
                )}
              </p>
            </div>
          </div>
        )}

        {/* Operating Status */}
        <div className="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                operatingStatus.isOperating
                  ? "bg-green-500 animate-[pulse-dot_2s_infinite]"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm font-semibold">
              {operatingStatus.isOperating
                ? `Active - ${OPERATING_HOURS[operatingStatus.currentBatch as keyof typeof OPERATING_HOURS]?.label} Batch`
                : operatingStatus.isWeekend 
                  ? "Weekend - Closed" 
                  : "Buses Not Operating"}
            </span>
          </div>
          {!operatingStatus.isOperating && operatingStatus.nextBatch && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Next Batch</p>
              <p className="text-sm font-bold">{formatNextBatchTime()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Routes */}
      <div className="flex-1 overflow-y-auto p-3.5">
        {routes.map((route, idx) => (
          <RouteCard
            key={route.id}
            route={route}
            displayIndex={idx + 1}
            isActive={activeRouteId === route.id}
            onToggle={() => onRouteToggle(route.id)}
            isOperating={
              operatingStatus.isOperating &&
              route.batches.some(b => 
                (typeof b === 'string' ? b.toLowerCase() : b.batch.toLowerCase()) === 
                (operatingStatus.currentBatch?.toLowerCase() || "")
              )
            }
            userLocation={userLocation}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
