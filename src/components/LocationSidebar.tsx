import { X, MapPin, Info, Navigation, Bus, Clock, Bike, Car, PersonStanding } from "lucide-react";
import { Location } from "@/data/routeData";
import { Button } from "./ui/button";
import { getDistance, calculateTravelTime } from "@/hooks/useGeolocation";

interface LocationSidebarProps {
  location: Location | null;
  userLocation: { lat: number; lng: number } | null;
  onClose: () => void;
  onGetDirections: (location: Location) => void;
  isActiveRoute: boolean;
}

export const LocationSidebar: React.FC<LocationSidebarProps> = ({
  location,
  userLocation,
  onClose,
  onGetDirections,
  isActiveRoute,
}) => {
  if (!location) return null;

  const distance = userLocation 
    ? getDistance(userLocation.lat, userLocation.lng, location.lat, location.lng)
    : null;

  const travelTimes = distance !== null ? {
    walk: calculateTravelTime(distance, 'walk'),
    bike: calculateTravelTime(distance, 'bike'),
    car: calculateTravelTime(distance, 'car')
  } : null;

  return (
    <div className="absolute top-4 right-4 bottom-4 w-[320px] md:w-[400px] bg-white dark:bg-slate-900 shadow-2xl rounded-3xl z-[1000] overflow-hidden flex flex-col animate-in slide-in-from-right duration-300 border border-slate-200 dark:border-slate-800">
      {/* Header Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {location.image ? (
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Bus className="h-16 w-16 text-slate-300 dark:text-slate-600" />
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h2 className="text-xl font-bold text-white leading-tight">{location.name}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          {distance !== null && (
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 flex items-center justify-between border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-primary/60">Distance</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{(distance / 1000).toFixed(2)} km away</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Est. Time</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{travelTimes?.car}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Address</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {location.address || "Punjab University, Quaid-i-Azam Campus, Lahore"}
              </p>
            </div>
          </div>

          {travelTimes && (
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <PersonStanding className="h-4 w-4 mx-auto text-slate-400 mb-1" />
                <p className="text-[10px] font-bold text-slate-400">{travelTimes.walk}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <Bike className="h-4 w-4 mx-auto text-slate-400 mb-1" />
                <p className="text-[10px] font-bold text-slate-400">{travelTimes.bike}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <Car className="h-4 w-4 mx-auto text-slate-400 mb-1" />
                <p className="text-[10px] font-bold text-slate-400">{travelTimes.car}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg mt-0.5">
              <Info className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Description</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {location.info || "Information about this stop is being updated. This stop is part of the Punjab University bus network."}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Quick Actions</h3>
          
          {isActiveRoute && travelTimes && (
            <div className="mb-4 p-4 bg-primary rounded-2xl text-white shadow-lg shadow-primary/30 animate-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Active Route</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Fastest</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black">{travelTimes.car}</p>
                  <p className="text-[10px] opacity-80 font-medium">Estimated Arrival Time</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{(distance! / 1000).toFixed(1)} km</p>
                  <p className="text-[10px] opacity-80 font-medium">Total Distance</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => onGetDirections(location)}
              variant={isActiveRoute ? "default" : "outline"}
              className={`flex items-center gap-2 rounded-xl h-11 transition-all ${
                isActiveRoute 
                  ? "bg-primary text-white" 
                  : "border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <Navigation className="h-4 w-4" />
              {isActiveRoute ? "Route Active" : "Directions"}
            </Button>
            <Button variant="outline" className="flex items-center gap-2 rounded-xl h-11">
              <Clock className="h-4 w-4" />
              Schedule
            </Button>
          </div>
          <Button className="w-full mt-3 flex items-center gap-2 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
            <Bus className="h-4 w-4" />
            Find Nearest Bus
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 text-center border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          PU Bus Portal • Official Location Data
        </p>
      </div>
    </div>
  );
};
