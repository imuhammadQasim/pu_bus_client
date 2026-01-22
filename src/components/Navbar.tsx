import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Menu, MapPin, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onLocateMe: () => void;
  isLocating: boolean;
  hasLocation: boolean;
  onShowCampuses: () => void;
  onShowHostels: () => void;
  onShowGrounds: () => void;
  onShowGates: () => void;
  onShowAllRoutes: () => void;
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLocateMe,
  isLocating,
  hasLocation,
  onShowCampuses,
  onShowHostels,
  onShowGrounds,
  onShowGates,
  onShowAllRoutes,
  onMenuToggle,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const isMobile = useIsMobile();
  const [titleVisible, setTitleVisible] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setTitleVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const slides = [
    [
      { label: 'Campuses', action: onShowCampuses },
      { label: 'Show all Routes', action: onShowAllRoutes },
      { label: 'Hostels', action: onShowHostels },
    ],
    [
      { label: 'Grounds', action: onShowGrounds },
      { label: 'Gates', action: onShowGates },
      { label: 'About US', action: () => {} },
    ],
  ];

  return (
    <nav className="bg-primary border-b border-border px-4 md:px-7 min-h-14 flex items-center justify-between shadow-sm z-[1000] relative">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className="text-white text-xl p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Logo */}
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg p-1 shadow-md flex items-center justify-center">
          <img
            src="https://pu.edu.pk/temp1/img/logo.png"
            alt="University of the Punjab Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title - Hidden on very small screens */}
        <div className={`flex-col hidden sm:flex transition-opacity duration-500 ${titleVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="font-poppins text-base md:text-lg font-bold text-white leading-tight tracking-tight">
            Punjab University Bus Routes
          </h1>
          <span className="text-xs text-slate-200 font-medium">
            Real-Time GIS Navigation System
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              disabled={slideIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-3 overflow-hidden">
              {slides[slideIndex].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="text-white text-xs font-medium px-3 py-1 rounded-lg hover:bg-white/10 transition-all hover:text-amber-400 whitespace-nowrap relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full group-hover:left-0" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setSlideIndex(Math.min(slides.length - 1, slideIndex + 1))}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              disabled={slideIndex === slides.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Locate Button */}
        <Button
          onClick={onLocateMe}
          className="bg-primary hover:bg-primary/90 text-white border border-white/20 shadow-md flex items-center gap-2"
          disabled={isLocating}
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : hasLocation ? (
            <X className="h-4 w-4" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {hasLocation ? 'Clear' : 'My Location'}
          </span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
