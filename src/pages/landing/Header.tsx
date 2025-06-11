import React from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";

const navigationItems = [
  { id: "about", label: "About" },
  { id: "how-it-works", label: "How it Works" },
  { id: "faq", label: "Help / FAQ" },
  { id: "contact", label: "Contact Support" }
];

const Header = () => {
  const handleSmoothScroll = ( e: React.MouseEvent<HTMLAnchorElement>, targetId: string ) => {
    e.preventDefault();
    const element = document.getElementById( targetId );
    if ( element ) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="PALMS Portal" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-primary">PALMS Portal</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map(( item ) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={( e ) => handleSmoothScroll( e, item.id )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Link to="/auth/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/auth/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
