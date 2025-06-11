import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import landingBg from "@/assets/images/landing-bg.png";

const Hero = () => {
  return (
    <section className="relative py-24 md:py-32 border-b border-gray-200 shadow-sm overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={landingBg}
          alt="Fireworks display over water"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-hawaii-black/60 via-hawaii-black/50 to-hawaii-black/60"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-white">
          Apply. Review. Manage.<br />
          <span className="text-primary mt-2 inline-block">All Fireworks Permits & Licenses in One Place.</span>
        </h1>
        <p className="text-base md:text-lg text-white/90 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
          Simplifying compliance with Hawaii&apos;s fireworks laws for citizens and officials.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/login">
            <Button size="lg" className="gap-2 text-base px-8 py-6 h-auto backdrop-blur-sm bg-primary/90 hover:bg-primary">
              Login to Get Started
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
