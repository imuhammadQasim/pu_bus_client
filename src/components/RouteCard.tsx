import React, { useState } from "react";
import {
  ChevronDown,
  Check,
  MapPin,
  Clock,
  PersonStanding,
  Bike,
  Car,
  Heart,
} from "lucide-react";
import { Route } from "@/data/routeData";
import { getDistance, calculateTravelTime } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface RouteCardProps {
  route: Route;
  displayIndex: number;
  isActive: boolean;
  onToggle: () => void;
  isOperating: boolean;
  userLocation: { lat: number; lng: number } | null;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  displayIndex,
  isActive,
  onToggle,
  isOperating,
  userLocation,
}) => {
  const { user, addFavoriteRoute, removeFavoriteRoute, isFavoriteRoute } = useAuth();

  const isFavorited = isFavoriteRoute(route.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please login to add routes to your favorites."
      });
      return;
    }

    if (isFavorited) {
      removeFavoriteRoute(route.id);
      toast.success("Removed from favorites");
    } else {
      addFavoriteRoute(route.id);
      toast.success("Added to favorites");
    }
  };
  // Calculate nearest stop and travel times
  const getNearestStop = () => {
    if (!userLocation) return null;

    let nearest = null;
    let minDist = Infinity;

    route.waypoints.forEach((wp) => {
      const dist = getDistance(
        userLocation.lat,
        userLocation.lng,
        wp.lat,
        wp.lng,
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = { ...wp, distance: dist };
      }
    });

    return nearest;
  };

  const nearestStop = getNearestStop();

  const generateTimeline = () => {
    return route.waypoints.map((wp, idx) => {
      const minutesOffset = idx * 12;
      const now = new Date();
      const eta = new Date(now.getTime() + minutesOffset * 60 * 1000);
      const etaStr = eta.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const statusClass = idx === 0 ? "current" : "future";

      return { ...wp, eta: etaStr, statusClass };
    });
  };

  const timeline = generateTimeline();

  return (
    <div className="mb-2.5 relative overflow-hidden rounded-lg">
      <div
        className={`bg-card rounded-lg shadow-sm border-2 transition-all ${
          isActive
            ? "border-primary shadow-lg"
            : "border-transparent hover:shadow-md hover:-translate-y-0.5"
        }`}
      >
        {/* Header */}
        <div
          className="p-3.5 cursor-pointer flex items-center justify-between select-none"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Badge */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold font-poppins text-base text-white shadow-md transition-transform hover:scale-105"
              style={{ backgroundColor: route.color }}
            >
              {displayIndex}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate">
                {route.name}
              </h3>
              <p className="text-xs text-muted-foreground">{route.desc}</p>
            </div>
          </div>

          {/* Status */}
          <div
            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ml-2 whitespace-nowrap ${
              isOperating
                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
            }`}
          >
            {isOperating && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
            {isOperating ? "Active" : "Inactive"}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="p-2 rounded-full hover:bg-muted transition-colors ml-1"
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorited
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
            />
          </button>

          {/* Expand Icon */}
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground ml-2 transition-transform ${
              isActive ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Body */}
        <div
          className={`overflow-hidden transition-all duration-500 bg-muted/50 border-t border-border ${
            isActive ? "max-h-[calc(100vh-220px)] overflow-y-auto" : "max-h-0"
          }`}
        >
          <div className="p-5 relative">
            {/* Timeline Line */}
            <div
              className="absolute left-[38px] top-9 bottom-9 w-0.5"
              style={{
                background:
                  "linear-gradient(to bottom, hsl(var(--border)) 0%, hsl(var(--border)) 50%, transparent 100%)",
              }}
            />

            {/* Stops */}
            {timeline.map((wp, idx) => (
              <div
                key={idx}
                className={`relative pl-12 mb-7 last:mb-0 z-10 ${
                  idx === 0 ? "stop-current" : ""
                }`}
              >
                {/* Marker */}
                <div
                  className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center border-3 shadow-md transition-all z-[2] ${
                    idx === 0
                      ? "bg-green-500 border-green-500 scale-125 shadow-[0_0_0_8px_rgba(16,185,129,0.2)] animate-[pulse-marker_2s_infinite]"
                      : "bg-card border-border"
                  }`}
                >
                  {idx === 0 && <MapPin className="h-3 w-3 text-white" />}
                </div>

                {/* Content */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">
                      {wp.name}
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1.5 font-medium ${
                        idx === 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {idx === 0 ? (
                        <>
                          <MapPin className="h-3 w-3" /> Boarding Now
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" /> Scheduled
                        </>
                      )}
                    </p>
                  </div>

                  <div
                    className={`text-xs font-bold px-2.5 py-1.5 rounded font-poppins border ${
                      idx === 0
                        ? "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-500"
                        : "bg-card border-border"
                    }`}
                  >
                    {wp.eta}
                  </div>
                </div>
              </div>
            ))}

            {/* Travel Info */}
            {userLocation && nearestStop && (
              <div className="mt-4 p-3.5 bg-card rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-bold uppercase tracking-wide">
                    Travel Time to Nearest Stop
                  </p>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full font-semibold">
                    {nearestStop.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2.5 bg-muted rounded-lg hover:border-primary border-2 border-transparent transition-all cursor-pointer hover:-translate-y-0.5">
                    <PersonStanding className="h-5 w-5 text-primary mx-auto mb-1.5" />
                    <p className="text-xs font-bold font-poppins">
                      {calculateTravelTime(nearestStop.distance, "walk")}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                      Walking
                    </p>
                  </div>

                  <div className="text-center p-2.5 bg-muted rounded-lg hover:border-primary border-2 border-transparent transition-all cursor-pointer hover:-translate-y-0.5">
                    <Bike className="h-5 w-5 text-primary mx-auto mb-1.5" />
                    <p className="text-xs font-bold font-poppins">
                      {calculateTravelTime(nearestStop.distance, "bike")}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                      Bike
                    </p>
                  </div>

                  <div className="text-center p-2.5 bg-muted rounded-lg hover:border-primary border-2 border-transparent transition-all cursor-pointer hover:-translate-y-0.5">
                    <Car className="h-5 w-5 text-primary mx-auto mb-1.5" />
                    <p className="text-xs font-bold font-poppins">
                      {calculateTravelTime(nearestStop.distance, "car")}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                      Car
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 px-2 py-1.5 bg-blue-50 dark:bg-blue-950 rounded text-center text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  Distance: {(nearestStop.distance / 1000).toFixed(2)} km
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
