import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React from "react";
import Sidebar from "./Sidebar";
import { logout } from "@/reduxStore/modules/auth/actions";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useNavigate } from "react-router";
import { useAstralAlert } from "@/hooks/useAstralAlert";
import { Loader } from "../ui/loader";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { UserId } = useAppSelector(( state ) => state.account );
  const [ mobileMenuOpen, setMobileMenuOpen ] = React.useState( false );
  const astralAlert = useAstralAlert();
  const handleLogout = () => {
    dispatch( logout( navigate, undefined, true, astralAlert ));
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar component */}
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
      />

      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-30 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen( true )}
          className="rounded-full bg-white shadow-md"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={20} aria-hidden="true" />
        </Button>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 overflow-auto" id="main-content">
        <div className="min-h-screen p-4 md:p-8">
          {UserId ? children : <Loader />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
