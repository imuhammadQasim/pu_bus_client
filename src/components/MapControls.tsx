import React from 'react';
import { Circle, MapPin, X, ChevronDown } from 'lucide-react';

interface MapControlsProps {
  onAddRadius: (type: 'current' | 'marker', radius: number) => void;
  onClearRadius: () => void;
  onFindClosestRoute: () => void;
  onToggleChooseOnMap: () => void;
  choosingOnMap: boolean;
  hasSelectedMarker: boolean;
  hasUserLocation: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onAddRadius,
  onClearRadius,
  onFindClosestRoute,
  onToggleChooseOnMap,
  choosingOnMap,
  hasSelectedMarker,
  hasUserLocation,
}) => {
  const [showRadiusMenu, setShowRadiusMenu] = React.useState(false);
  const [showRadiusSize, setShowRadiusSize] = React.useState(false);
  const [selectedRadiusType, setSelectedRadiusType] = React.useState<'current' | 'marker' | null>(null);

  const radiusOptions = [2, 4, 6, 8, 10, 12, 14, 16];

  const handleRadiusTypeSelect = (type: 'current' | 'marker' | 'clear') => {
    if (type === 'clear') {
      onClearRadius();
      setShowRadiusMenu(false);
    } else {
      setSelectedRadiusType(type);
      setShowRadiusMenu(false);
      setShowRadiusSize(true);
    }
  };

  const handleRadiusSizeSelect = (size: number) => {
    if (selectedRadiusType) {
      onAddRadius(selectedRadiusType, size);
    }
    setShowRadiusSize(false);
    setSelectedRadiusType(null);
  };

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-2 z-[1000]">
      {/* Radius Button */}
      <div className="relative">
        <button
          onClick={() => setShowRadiusMenu(!showRadiusMenu)}
          className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium shadow-md hover:bg-primary/90 transition-all flex items-center gap-1.5"
        >
          <Circle className="h-3 w-3" />
          Add radius
        </button>

        {/* Radius Type Menu */}
        {showRadiusMenu && (
          <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg min-w-48 overflow-hidden">
            <button
              onClick={() => handleRadiusTypeSelect('current')}
              disabled={!hasUserLocation}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span>To your current location</span>
            </button>
            <button
              onClick={() => handleRadiusTypeSelect('marker')}
              disabled={!hasSelectedMarker}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span>Selected marker</span>
            </button>
            <button
              onClick={() => handleRadiusTypeSelect('clear')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-primary" />
              <span>Clear radius</span>
            </button>
          </div>
        )}

        {/* Radius Size Menu */}
        {showRadiusSize && (
          <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg min-w-40 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
              <span className="text-sm font-semibold">Select Radius (km)</span>
              <button
                onClick={() => {
                  setShowRadiusSize(false);
                  setSelectedRadiusType(null);
                }}
                className="p-1 rounded hover:bg-card transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-0">
              {radiusOptions.map((radius) => (
                <button
                  key={radius}
                  onClick={() => handleRadiusSizeSelect(radius)}
                  className="px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors border-b border-r border-border last:border-b-0 [&:nth-child(2n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0"
                >
                  {radius} km
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Closest Route Button */}
      <button
        onClick={onFindClosestRoute}
        className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium shadow-md hover:bg-primary/90 transition-all"
      >
        Closest Route
      </button>

      {/* Choose on Map Button */}
      <button
        onClick={onToggleChooseOnMap}
        className={`px-3 py-2 rounded-lg text-xs font-medium shadow-md transition-all ${
          choosingOnMap
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        Choose on Map
      </button>
    </div>
  );
};

export default MapControls;
