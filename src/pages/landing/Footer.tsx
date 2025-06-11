import { Mail } from "lucide-react";
import { Link } from "react-router";

import { HAWAII_CONTACT_INFO, APP_VERSION } from "@/constants";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border py-8" id="contact">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="https://portal.ehawaii.gov/page/privacy-policy/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="https://portal.ehawaii.gov/page/terms-of-use/" className="hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link to="https://portal.ehawaii.gov/page/accessibility/" className="hover:text-primary transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href={`mailto:${HAWAII_CONTACT_INFO.email}`} className="hover:text-primary transition-colors">{HAWAII_CONTACT_INFO.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-sm text-muted-foreground text-center">
          <p>&copy; Department of Law Enforcement, Permit and License Management System (PALMS). All rights reserved.</p>
          <p>PALMS Portal v{APP_VERSION.number} — Updated {APP_VERSION.lastUpdated}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
