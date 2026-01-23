import React, { useState, useCallback, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MapContainer } from "@/components/MapContainer";
import { MapControls } from "@/components/MapControls";
import { MenuSidebar } from "@/components/MenuSidebar";
import { Footer } from "@/components/Footer";
import { Location, Route } from "@/data/routeData";
import { useOperatingStatus } from "@/hooks/useOperatingStatus";
import { useGeolocation, getDistance } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/index";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRouteId, setActiveRouteId] = useState<number | string | null>(
    null,
  );
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [visibleLocations, setVisibleLocations] = useState<Location[]>([]);
  const [locationType, setLocationType] = useState<
    "campuses" | "hostels" | "grounds" | "gates" | null
  >(null);
  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [radiusCircle, setRadiusCircle] = useState<{
    center: { lat: number; lng: number };
    radius: number;
  } | null>(null);
  const [choosingOnMap, setChoosingOnMap] = useState(false);
  const [apiHostels, setApiHostels] = useState<Location[]>([]);
  const [apiCampuses, setApiCampuses] = useState<Location[]>([]);
  const [apiGrounds, setApiGrounds] = useState<Location[]>([]);
  const [apiGates, setApiGates] = useState<Location[]>([]);
  const [apiRoutes, setApiRoutes] = useState<Route[]>([]);

  const {
    position: userLocation,
    isLoading: isLocating,
    getLocation,
    clearLocation,
  } = useGeolocation();
  const operatingStatus = useOperatingStatus();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const [hostelsData, campusesData, groundsData, gatesData, routesData] =
          await Promise.all([
            apiService.getHostels(),
            apiService.getCampuses(),
            apiService.getGrounds(),
            apiService.getGates(),
            apiService.getRoutes(),
          ]);

        if (Array.isArray(hostelsData)) setApiHostels(hostelsData);
        if (Array.isArray(campusesData)) setApiCampuses(campusesData);
        if (Array.isArray(groundsData)) setApiGrounds(groundsData);
        if (Array.isArray(gatesData)) setApiGates(gatesData);

        if (Array.isArray(routesData)) {
          setApiRoutes(routesData);
        } else if (routesData && typeof routesData === "object") {
          const possibleRoutes =
            (routesData as any).routes ||
            (routesData as any).data ||
            (routesData as any).allRoutes ||
            (routesData as any).all;
          if (Array.isArray(possibleRoutes)) {
            setApiRoutes(possibleRoutes);
          } else {
            console.warn(
              "Could not find routes array in object response:",
              routesData,
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchAllLocations();
  }, []);

  const handleLocateMe = useCallback(() => {
    if (userLocation) {
      clearLocation();
      setRadiusCircle(null);
    } else {
      getLocation();
    }
  }, [userLocation, clearLocation, getLocation]);

  const handleRouteToggle = useCallback((routeId: number) => {
    setShowAllRoutes(false);
    setActiveRouteId((prev) => (prev === routeId ? null : routeId));
  }, []);

  const handleShowLocations = useCallback(
    (type: "campuses" | "hostels" | "grounds" | "gates") => {
      const locationMap = {
        campuses: apiCampuses,
        hostels: apiHostels,
        grounds: apiGrounds,
        gates: apiGates,
      };
      setVisibleLocations(locationMap[type]);
      setLocationType(type);
      setActiveRouteId(null);
      setShowAllRoutes(false);
    },
    [apiHostels, apiCampuses, apiGrounds, apiGates],
  );

  const handleShowAllRoutes = useCallback(() => {
    setShowAllRoutes(true);
    setActiveRouteId(null);
    setVisibleLocations([]);
    setLocationType(null);
  }, []);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (choosingOnMap) {
        setSelectedMarker({ lat, lng });
      } else {
        setActiveRouteId(null);
        setVisibleLocations([]);
        setLocationType(null);
      }
    },
    [choosingOnMap],
  );

  const handleSearchSelect = useCallback(
    (lat: number, lng: number, _address: string) => {
      setSelectedMarker({ lat, lng });
    },
    [],
  );

  const handleAddRadius = useCallback(
    (type: "current" | "marker", radius: number) => {
      const center = type === "current" ? userLocation : selectedMarker;
      if (center) {
        setRadiusCircle({ center, radius });
      } else {
        toast({
          title: "Error",
          description:
            type === "current"
              ? "Please enable location first"
              : "Please select a marker first",
        });
      }
    },
    [userLocation, selectedMarker, toast],
  );

  const handleFindClosestRoute = useCallback(() => {
    const ref = userLocation || selectedMarker;
    if (!ref) {
      toast({
        title: "Location Required",
        description: "Enable location or select a point on map",
      });
      return;
    }

    let closestRoute = null;
    let minDist = Infinity;
    apiRoutes.forEach((route) => {
      route.waypoints.forEach((wp) => {
        const dist = getDistance(ref.lat, ref.lng, wp.lat, wp.lng);
        if (dist < minDist) {
          minDist = dist;
          closestRoute = route;
        }
      });
    });

    if (closestRoute) {
      setActiveRouteId((closestRoute as any).id);
      setShowAllRoutes(false);
    }
  }, [userLocation, selectedMarker, toast, apiRoutes]);

  const handleToggleChooseOnMap = useCallback(() => {
    if (selectedMarker) {
      setSelectedMarker(null);
      setChoosingOnMap(false);
    } else {
      setChoosingOnMap((prev) => !prev);
      if (!choosingOnMap) {
        toast({
          title: "Choose on Map",
          description: "Click on the map to place a marker",
        });
      }
    }
  }, [selectedMarker, choosingOnMap, toast]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  const activeRoute = apiRoutes.find((r) => r.id === activeRouteId) || null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        hasLocation={!!userLocation}
        onShowCampuses={() => handleShowLocations("campuses")}
        onShowHostels={() => handleShowLocations("hostels")}
        onShowGrounds={() => handleShowLocations("grounds")}
        onShowGates={() => handleShowLocations("gates")}
        onShowAllRoutes={handleShowAllRoutes}
        onMenuToggle={() => setMenuOpen(true)}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <MenuSidebar
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          onShowCampuses={() => handleShowLocations("campuses")}
          onShowHostels={() => handleShowLocations("hostels")}
          onShowGrounds={() => handleShowLocations("grounds")}
          onShowGates={() => handleShowLocations("gates")}
          onShowAllRoutes={handleShowAllRoutes}
        />

        <Sidebar
          routes={apiRoutes}
          activeRouteId={activeRouteId}
          onRouteToggle={handleRouteToggle}
          userLocation={userLocation}
          onSearchSelect={handleSearchSelect}
          operatingStatus={operatingStatus}
        />

        <div className="flex-1 relative">
          <MapControls
            onAddRadius={handleAddRadius}
            onClearRadius={() => setRadiusCircle(null)}
            onFindClosestRoute={handleFindClosestRoute}
            onToggleChooseOnMap={handleToggleChooseOnMap}
            choosingOnMap={choosingOnMap}
            hasSelectedMarker={!!selectedMarker}
            hasUserLocation={!!userLocation}
          />

          <MapContainer
            userLocation={userLocation}
            selectedMarker={selectedMarker}
            onMapClick={handleMapClick}
            activeRoute={activeRoute}
            visibleLocations={visibleLocations}
            locationType={locationType}
            radiusCircle={radiusCircle}
            choosingOnMap={choosingOnMap}
            showAllRoutes={showAllRoutes}
            onLocationSelect={() => {}}
            allRoutes={apiRoutes}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
