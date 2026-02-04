import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  'Sites Web Sur Mesure',
  'Sites E-Commerce',
  'Portfolio',
  'Sites Vitrines',
  'Applications Web',
  'Applications Mobiles',
  'Automatisation',
];

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.services-title',
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
    }, sectionRef);

    // Auto-rotate carousel
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 2500);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_hsl(217_91%_53%_/_0.05)_0%,_transparent_50%)]" />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-20">
          {/* Left Side - Static Text */}
          <div className="services-title w-full lg:w-1/2 text-center lg:text-left">
            <span className="inline-block text-xs md:text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4 md:mb-6">
              Nos Services
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
              Mise sur pied de
            </h2>
          </div>

          {/* Right Side - Vertical Carousel */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[280px] md:h-[320px] lg:h-[350px] overflow-hidden">
              {/* Gradient Masks */}
              <div className="absolute top-0 left-0 right-0 h-20 md:h-24 bg-gradient-to-b from-background via-background/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-20 md:h-24 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />

              {/* Carousel Items */}
              <div className="relative h-full flex items-center justify-center">
                {services.map((service, index) => {
                  const position = (index - activeIndex + services.length) % services.length;
                  
                  // Calculate vertical position
                  let translateY = 0;
                  let opacity = 0;
                  let scale = 0.85;
                  let zIndex = 0;
                  
                  if (position === 0) {
                    // Active item - center
                    translateY = 0;
                    opacity = 1;
                    scale = 1;
                    zIndex = 3;
                  } else if (position === 1) {
                    // Next item - below
                    translateY = 70;
                    opacity = 0.4;
                    scale = 0.9;
                    zIndex = 2;
                  } else if (position === services.length - 1) {
                    // Previous item - above
                    translateY = -70;
                    opacity = 0.4;
                    scale = 0.9;
                    zIndex = 2;
                  } else if (position === 2) {
                    // Two items below
                    translateY = 140;
                    opacity = 0.15;
                    scale = 0.85;
                    zIndex = 1;
                  } else if (position === services.length - 2) {
                    // Two items above
                    translateY = -140;
                    opacity = 0.15;
                    scale = 0.85;
                    zIndex = 1;
                  } else {
                    // Hidden items
                    translateY = position < services.length / 2 ? 210 : -210;
                    opacity = 0;
                    scale = 0.8;
                    zIndex = 0;
                  }
                  
                  return (
                    <div
                      key={index}
                      className="absolute inset-x-0 flex items-center justify-center transition-all duration-700 ease-out px-4"
                      style={{
                        transform: `translateY(${translateY}px) scale(${scale})`,
                        opacity,
                        zIndex,
                      }}
                    >
                      <span 
                        className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-center transition-all duration-700 ${
                          position === 0
                            ? 'text-gradient drop-shadow-[0_0_20px_hsl(217_91%_53%_/_0.4)]' 
                            : 'text-muted-foreground/50'
                        }`}
                      >
                        {service}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Center highlight line */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[60px] md:h-[70px] border-y border-primary/20 pointer-events-none z-[5]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Service indicators */}
        <div className="flex justify-center gap-2 mt-8 md:mt-12">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Afficher ${services[index]}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;