import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: 'Complexe TH', logo: '/logos/th_logo.png' },
  { name: 'Boulangerie Française', logo: '/logos/bf.png' },
  { name: 'CFPAM Group', logo: '/logos/cfpamlogo.jpg' },
  { name: 'Rine Deco', logo: '/logos/RD.jpeg' },
  { name: 'NGOMA DIGITAL', logo: '/logos/ngoma.png' },
  { name: 'Freemo Pay', logo: '/logos/freemopay.jpg' },
  { name: 'Money Fusion', logo: '/logos/moneyfusion.jpg' },
  { name: 'La maison des teckels', logo: '/logos/lmt.png' },
];

const Partners = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.partners-header',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Infinite horizontal scroll for logos (seamless loop)
      const track = trackRef.current;
      if (track) {
        const logoWidth = 176; // 160px + 16px gap
        const totalWidth = partners.length * logoWidth;
        
        // Continuous animation
        gsap.to(track, {
          x: -totalWidth,
          duration: 20,
          ease: 'none',
          repeat: -1,
        });
      }

      // Spotlight effect based on position
      const updateSpotlight = () => {
        const centerX = window.innerWidth / 2;
        const spotlightRange = 250;

        logosRef.current.forEach((logo) => {
          if (!logo) return;
          
          const rect = logo.getBoundingClientRect();
          const logoCenter = rect.left + rect.width / 2;
          const distanceFromCenter = Math.abs(centerX - logoCenter);
          
          const intensity = Math.max(0, 1 - distanceFromCenter / spotlightRange);
          
          const grayscale = 70 - (intensity * 70);
          const brightness = 0.6 + (intensity * 0.5);
          const opacity = 0.5 + (intensity * 0.5);
          const scale = 0.95 + (intensity * 0.1);
          
          gsap.to(logo, {
            filter: `grayscale(${grayscale}%) brightness(${brightness})`,
            opacity: opacity,
            scale: scale,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      };

      gsap.ticker.add(updateSpotlight);

      return () => {
        gsap.ticker.remove(updateSpotlight);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Triple duplication for truly seamless loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-background relative overflow-hidden"
    >
      <div className="container-custom mb-12">
        <div className="partners-header text-center">
          <span className="inline-block text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
            Ils nous font confiance
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Nos partenaires
          </h2>
        </div>
      </div>

      {/* Logos Carousel */}
      <div className="relative overflow-hidden py-8">
        {/* Gradient masks on sides */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Visual spotlight indicator */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 w-[500px] -translate-x-1/2 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />

        <div 
          ref={trackRef} 
          className="flex items-center gap-4"
          style={{ willChange: 'transform' }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              ref={(el) => {
                if (el) logosRef.current[index] = el;
              }}
              className="flex-shrink-0 w-[160px] h-[80px] flex items-center justify-center transition-transform duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;