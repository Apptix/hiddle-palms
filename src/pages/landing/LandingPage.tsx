import Header from "@/pages/landing/Header";
import Hero from "@/pages/landing/Hero";
import PermitTypes from "@/pages/landing/PermitTypes";
import HowItWorks from "@/pages/landing/HowItWorks";
import FAQ from "@/pages/landing/FAQ";
import Footer from "@/pages/landing/Footer";

const LandingPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <Hero />
      <PermitTypes />
      <HowItWorks />
      {/* <Requirements /> */}
      {/* <Alerts /> */}
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
