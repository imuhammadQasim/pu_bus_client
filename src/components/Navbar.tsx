import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Menu, MapPin, Loader2, X, User, LogOut } from 'lucide-react';
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
        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
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


        {/* User Actions */}
        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/profile">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl px-4 transition-all"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-bold">{user.firstName}</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl transition-all"
                >
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1 shadow-2xl border-slate-100 dark:border-slate-800">
                <div className="px-3 py-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer">
                  <Link to="/profile" className="flex items-center w-full px-2 py-2 font-semibold text-sm">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="rounded-xl focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer px-2 py-2 font-semibold text-sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl font-bold transition-all"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95">
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
