import {
  FileStack,
  FileText,
  Home,
  LogOut,
  User,
  Users,
  X
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/hooks";
import LogoutModal from "./LogoutModal";

interface INavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

const NavItem = ({ to, icon, label, active, onClick, ariaLabel }: INavItemProps ) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    )}
    onClick={onClick}
    aria-label={ariaLabel || label}
    aria-current={active ? "page" : undefined}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

interface ISidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen, handleLogout }: ISidebarProps ) => {
  const { account } = useAppSelector(({ account: acc }) => ({ account: acc }));
  const [ logoutModal, showLogoutModal ] = React.useState( false );
  const location = useLocation();

  const isActive = ( path: string ) => {
    return location.pathname === path;
  };

  const renderNavItems = () => {
    // Base navigation items for all users
    const baseNav = [
      { to: "/dashboard", icon: <Home size={18} />, label: "Dashboard" },
      { to: "/applications", icon: <FileText size={18} />, label: "Applications" }
    ];

    // Documents section - only show for regular users (not admins or inspectors)
    const documentsNav = account?.RoleId === "user" ?
      [{ to: "/documents", icon: <FileStack size={18} />, label: "My Documents" }] :
      [];

    // Profile section - show for all users
    const profileNav = [
      { to: "/profile", icon: <User size={18} />, label: "Profile" }
    ];

    // Admin-specific navigation
    const adminNav = [
      { to: "/users", icon: <Users size={18} />, label: "Users" }
    ];

    // Combine the navigation items based on user role
    const navItems = [ ...baseNav, ...documentsNav, ...( account?.RoleId === "admin" ? adminNav : []), ...profileNav ];

    return navItems.map(( item ) => (
      <NavItem
        key={item.to}
        to={item.to}
        icon={item.icon}
        label={item.label}
        active={isActive( item.to )}
        onClick={() => setMobileMenuOpen( false )}
      />
    ));
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed hidden lg:flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border" aria-label="Main Navigation">
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <img src="/images/logo.png" alt="" className="w-8 h-8" />
            <span className="text-lg font-bold">PALMS Portal</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <div role="navigation" aria-labelledby="nav-heading">
            {renderNavItems()}
          </div>
        </nav>

        <div className="mt-auto p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            onClick={() => showLogoutModal( true )}
            aria-label="Log Out"
          >
            <LogOut size={18} className="mr-2" aria-hidden="true" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen( false )}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div
            className="fixed inset-y-0 left-0 w-3/4 max-w-64 bg-sidebar p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
                <img src="/images/logo.png" alt="PALMS Portal" className="w-8 h-8" />
                <span className="text-lg font-bold">PALMS Portal</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen( false )}
                aria-label="Close menu"
              >
                <X size={20} aria-hidden="true" />
              </Button>
            </div>

            <nav className="flex flex-col gap-2">
              {renderNavItems()}
            </nav>

            <div className="mt-auto pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                onClick={() => showLogoutModal( true )}
                aria-label="Log Out"
              >
                <LogOut size={18} className="mr-2" aria-hidden="true" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
      <LogoutModal
        isOpen={logoutModal}
        onClose={() => showLogoutModal( false )}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default Sidebar;
