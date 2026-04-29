import React from 'react';
import { X, LogOut, User, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onShowCampuses: () => void;
  onShowHostels: () => void;
  onShowGrounds: () => void;
  onShowGates: () => void;
  onShowAllRoutes: () => void;
}

export const MenuSidebar: React.FC<MenuSidebarProps> = ({
  isOpen,
  onClose,
  onShowCampuses,
  onShowHostels,
  onShowGrounds,
  onShowGates,
  onShowAllRoutes,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAction = (action: () => void) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => action(), 100);
    } else {
      action();
    }
    onClose();
  };

  const menuItems = [
    { label: 'Departments', action: () => handleAction(onShowCampuses) },
    { label: 'Show all Routes', action: () => handleAction(onShowAllRoutes) },
     { label: 'Bus Challan', link: '/bus-challan' },
    { label: 'Lost & Found', link: '/lost-and-found' },
    { label: 'Report Issue', link: '/report' },
    { label: 'Hostels', action: () => handleAction(onShowHostels) },
    { label: 'Grounds', action: () => handleAction(onShowGrounds) },
    { label: 'Gates', action: () => handleAction(onShowGates) },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 w-80 h-full bg-white dark:bg-slate-900 flex flex-col shadow-2xl z-[1100] transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <User className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-poppins tracking-tight">
            Punjab University Bus System
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* User Section (If logged in) */}
      {user && (
        <div className="px-6 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center justify-between group p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm border border-transparent hover:border-primary/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {user.firstName}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {user.email}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
          </Link>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto px-4">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Main Menu
        </p>
        <div className="space-y-1">
          {menuItems.map((item: any, idx) =>
            item.link ? (
              <Link
                key={idx}
                to={item.link}
                onClick={onClose}
                className="w-full flex items-center h-12 px-4 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-primary/5 hover:text-primary rounded-xl transition-all group"
              >
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            ) : (
              <button
                key={idx}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="w-full flex items-center h-12 px-4 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-primary/5 hover:text-primary rounded-xl transition-all group"
              >
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            ),
          )}
        </div>
      </nav>

      {/* Footer / Auth Actions */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
        {user ? (
          <Button
            onClick={() => {
              logout();
              onClose();
            }}
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-bold h-12 rounded-xl px-4"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link to="/login" onClick={onClose}>
              <Button
                variant="outline"
                className="w-full rounded-xl font-bold h-11"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup" onClick={onClose}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-bold h-11">
                Join
              </Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MenuSidebar;
