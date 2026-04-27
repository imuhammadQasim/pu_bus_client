import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Menu, MapPin, Loader2, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onLoginClick?: () => void;
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
  onLoginClick,
}) => {
  const isMobile = useIsMobile();
  const [titleVisible, setTitleVisible] = useState(false);
  const { user, logout } = useAuth();

  React.useEffect(() => {
    const timer = setTimeout(() => setTitleVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { label: 'Campuses', action: onShowCampuses },
    { label: 'Show all Routes', action: onShowAllRoutes },
    { label: 'Bus Challan', link: '/bus-challan' },
    { label: 'Hostels', action: onShowHostels },
    { label: 'Grounds', action: onShowGrounds },
    { label: 'Gates', action: onShowGates },
  ];

  return (
    <nav className="bg-primary border-b border-border px-4 md:px-7 min-h-16 flex items-center justify-between shadow-md z-[1000] relative">
      {/* Left: Brand */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className="text-white text-xl p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl p-1.5 shadow-lg flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <img
              src="https://pu.edu.pk/temp1/img/logo.png"
              alt="PU Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Title */}
          <div className={`flex flex-col transition-all duration-700 ${titleVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <h1 className="font-poppins text-base md:text-lg font-extrabold text-white leading-tight tracking-tight">
              PU Bus Routes
            </h1>
            <span className="text-[10px] md:text-xs text-blue-200 font-semibold tracking-wide uppercase">
              GIS Navigation System
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Desktop Navigation */}
      {!isMobile && (
        <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          {navItems.map((item: any, i) => (
            item.link ? (
              <Link
                key={i}
                to={item.link}
                className="text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transition-all hover:text-amber-400 whitespace-nowrap relative group"
              >
                {item.label}
                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-1/2 group-hover:left-1/4" />
              </Link>
            ) : (
              <button
                key={i}
                onClick={item.action}
                className="text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transition-all hover:text-amber-400 whitespace-nowrap relative group"
              >
                {item.label}
                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-1/2 group-hover:left-1/4" />
              </button>
            )
          ))}
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Locate Button */}
        <Button
          onClick={onLocateMe}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm flex items-center gap-2 rounded-xl transition-all h-10 px-4"
          disabled={isLocating}
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : hasLocation ? (
            <X className="h-4 w-4" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span className="hidden xl:inline font-bold">
            {hasLocation ? 'Clear' : 'My Location'}
          </span>
        </Button>


        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">{user.firstName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="text-xs text-muted-foreground">
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
