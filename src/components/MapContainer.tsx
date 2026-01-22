import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Route, Location, routes } from '@/data/routeData';
import { getDistance } from '@/hooks/useGeolocation';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapContainerProps {
  userLocation: { lat: number; lng: number } | null;
  selectedMarker: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
  activeRoute: Route | null;
  visibleLocations: Location[];
  locationType: 'campuses' | 'hostels' | 'grounds' | 'gates' | null;
  radiusCircle: { center: { lat: number; lng: number }; radius: number } | null;
  choosingOnMap: boolean;
  showAllRoutes: boolean;
  onLocationSelect: (location: Location) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  userLocation,
  selectedMarker,
  onMapClick,
  activeRoute,
  visibleLocations,
  locationType,
  radiusCircle,
  choosingOnMap,
  showAllRoutes,
  onLocationSelect,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const routeLayersRef = useRef<{ [key: number]: L.LayerGroup }>({});
  const locationMarkersRef = useRef<L.Marker[]>([]);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([31.4981, 74.305], 13);

    // Base layers
    const baseLayers = {
      Standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }),
      Satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
      }),
      'Dark Mode': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }),
    };

    baseLayers.Standard.addTo(map);
    L.control.layers(baseLayers, undefined, { position: 'topright' }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle user location marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-icon',
        html: `
          <div style="position: relative;">
            <div class="user-marker-pulse"></div>
            <div class="user-marker"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup('Your Location');

      mapRef.current.setView([userLocation.lat, userLocation.lng], 16);
    }
  }, [userLocation]);

  // Handle selected marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedMarkerRef.current) {
      mapRef.current.removeLayer(selectedMarkerRef.current);
      selectedMarkerRef.current = null;
    }

    if (selectedMarker) {
      const redIcon = L.divIcon({
        className: 'selected-marker',
        html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(255,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      selectedMarkerRef.current = L.marker([selectedMarker.lat, selectedMarker.lng], { icon: redIcon })
        .addTo(mapRef.current)
        .bindPopup(`Selected Location<br>${selectedMarker.lat.toFixed(5)}, ${selectedMarker.lng.toFixed(5)}`)
        .openPopup();
    }
  }, [selectedMarker]);

  // Handle route rendering
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing route layers
    Object.values(routeLayersRef.current).forEach(layer => {
      mapRef.current?.removeLayer(layer);
    });
    routeLayersRef.current = {};

    const routesToRender = showAllRoutes ? routes : activeRoute ? [activeRoute] : [];

    routesToRender.forEach(route => {
      const layerGroup = L.layerGroup().addTo(mapRef.current!);
      routeLayersRef.current[route.id] = layerGroup;

      // Add stop markers
      route.waypoints.forEach((wp, idx) => {
        const isTerminal = idx === 0 || idx === route.waypoints.length - 1;
        const size = isTerminal ? 24 : 18;

        const marker = L.marker([wp.lat, wp.lng], {
          icon: L.divIcon({
            html: `
              <div style="
                width: ${size}px;
                height: ${size}px;
                background-color: ${route.color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                ${isTerminal ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>` : ''}
              </div>
            `,
            className: 'custom-bus-icon',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          }),
        }).addTo(layerGroup);

        marker.bindPopup(`
          <div style="padding: 12px; min-width: 220px;">
            <strong style="font-size: 1.05rem; color: ${route.color};">${wp.name}</strong><br>
            <span style="font-size: 0.85rem; color: #64748b; margin-top: 4px; display: block;">
              ${isTerminal ? (idx === 0 ? '🚌 Origin' : '🏁 Terminal') : `📍 Stop ${idx}`} • Route ${route.id}
            </span>
          </div>
        `);
      });

      // Draw route line (straight lines between waypoints)
      const latlngs = route.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]);
      
      L.polyline(latlngs, {
        color: 'white',
        weight: 9,
        opacity: 1,
      }).addTo(layerGroup);

      L.polyline(latlngs, {
        color: route.color,
        weight: 6,
        opacity: 0.9,
      }).addTo(layerGroup);
    });

    // Fit bounds if routes exist
    if (routesToRender.length > 0) {
      const allPoints = routesToRender.flatMap(r => r.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]));
      if (allPoints.length > 0) {
        mapRef.current.fitBounds(L.latLngBounds(allPoints), { padding: [60, 60] });
      }
    }
  }, [activeRoute, showAllRoutes]);

  // Handle location markers (campuses, hostels, etc.)
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing location markers
    locationMarkersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    locationMarkersRef.current = [];

    const colors: { [key: string]: string } = {
      campuses: '#1e3a8a',
      hostels: '#ef4444',
      grounds: '#10b981',
      gates: '#f59e0b',
    };

    const color = locationType ? colors[locationType] : '#1e3a8a';

    visibleLocations.forEach(location => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([location.lat, location.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="padding: 12px; min-width: 220px;">
            <h3 style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 1.1rem; font-weight: 600;">${location.name}</h3>
            ${location.image ? `<img src="${location.image}" alt="${location.name}" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;" onerror="this.style.display='none'" />` : ''}
            <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: #64748b;">${location.info}</p>
            <p style="margin: 0; font-size: 0.8rem; color: #94a3b8;"><i class="fa-solid fa-map-marker-alt"></i> ${location.address}</p>
          </div>
        `);

      marker.on('click', () => onLocationSelect(location));
      locationMarkersRef.current.push(marker);
    });

    if (visibleLocations.length > 0) {
      const bounds = L.latLngBounds(visibleLocations.map(l => [l.lat, l.lng] as [number, number]));
      mapRef.current.fitBounds(bounds.pad(0.1));
    }
  }, [visibleLocations, locationType, onLocationSelect]);

  // Handle radius circle
  useEffect(() => {
    if (!mapRef.current) return;

    if (radiusCircleRef.current) {
      mapRef.current.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = null;
    }

    if (radiusCircle) {
      radiusCircleRef.current = L.circle(
        [radiusCircle.center.lat, radiusCircle.center.lng],
        {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 2,
          radius: radiusCircle.radius * 1000, // km to meters
        }
      ).addTo(mapRef.current);

      mapRef.current.fitBounds(radiusCircleRef.current.getBounds(), { padding: [20, 20] });
    }
  }, [radiusCircle]);

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full ${choosingOnMap ? 'cursor-crosshair' : ''}`}
    />
  );
};

export default MapContainer;
