import LandingNavbar from "../components/LandingNavbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <LandingNavbar />

      <Hero />

      <Features />

      <Stats />

      <HowItWorks />

      <Footer />
    </div>
  );
}