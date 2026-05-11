import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Problems from '@/components/Problems';
import HourglassAnimation from '@/components/HourglassAnimation';
import Services from '@/components/Services';
import Realisations from '@/components/Realisations';
import Partners from '@/components/Partners';
import Technologies from '@/components/Technologies';
import About from '@/components/About';
import Locaux from '@/components/Locaux';
import Contact from '@/components/Contact';
import Map from '@/components/Map';
import Footer from '@/components/Footer';
import PriceEstimator from '@/components/PriceEstimator';
import { Helmet } from 'react-helmet';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    ScrollTrigger.refresh();

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div className="relative">
      <Helmet>
        <title>Tech Forge Solutions</title>
      </Helmet>

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Hero />
        <Problems />
        <HourglassAnimation />
        <Services />
        <Realisations />
        <Partners />
        <Technologies />
        <About />
        <Contact />
        <Map />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Price Estimator — accessible depuis n'importe quelle section */}
      <PriceEstimator />
    </div>
  );
};

export default Index;