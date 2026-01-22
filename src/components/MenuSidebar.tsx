import React from 'react';
import { X } from 'lucide-react';

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
  const menuItems = [
    { label: 'Campuses', action: onShowCampuses },
    { label: 'Show all Routes', action: onShowAllRoutes },
    { label: 'Hostels', action: onShowHostels },
    { label: 'Grounds', action: onShowGrounds },
    { label: 'Gates', action: onShowGates },
    { label: 'About US', action: () => {} },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 w-72 h-full bg-card flex flex-col shadow-2xl z-[1100] transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-card border-b-0">
        <h2 className="text-xl font-medium text-foreground font-poppins">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              item.action();
              onClose();
            }}
            className="w-full flex items-center h-12 px-6 text-muted-foreground font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-all mr-2 rounded-r-full"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default MenuSidebar;
