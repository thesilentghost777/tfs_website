import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.8 });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Simple Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

      {/* Content */}

      {/* Logo - Centré sur mobile, à gauche sur desktop */}
      <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 md:left-32 md:translate-x-0">
        <img 
          src="/logos/logo_final.png" 
          alt="TechForge Solution 237" 
          className="h-12 md:h-20 w-auto opacity-90"
        />
      </div>

      <div className="relative z-10 container-custom px-4 pt-24 md:pt-0">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge - Optimisé pour mobile */}
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2 rounded-full border border-border bg-muted/30 backdrop-blur-sm mb-10 md:mb-10">
            <span className="text-xs md:text-sm font-medium tracking-wide uppercase text-muted-foreground">
              Forge à solution sur mesure
            </span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1] mb-10 md:mb-8 tracking-tight"
          >
            <span className="block">Libérez votre</span>
            <span className="block text-gradient">temps précieux</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 md:mb-12 leading-relaxed"
          >
            Nous concevons des solutions digitales sur mesure pour automatiser votre business 
            et vous redonner le contrôle de votre temps.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-4">
            <a href="#contact" className="btn-primary w-full sm:w-auto">
              Démarrer maintenant
            </a>
            <a href="#realisations" className="btn-outline w-full sm:w-auto">
              Voir nos réalisations
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-8 mt-20 md:mt-24 pt-10 md:pt-12 border-t border-border/30">
            {[
              { value: '50+', label: 'Projets livrés' },
              { value: '15+', label: 'Clients satisfaits' },
              { value: '5+', label: "Années d'expertise" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient mb-2 md:mb-0">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Subtle fade down animation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-[2px] h-16 bg-gradient-to-b from-transparent via-muted-foreground/40 to-transparent animate-scroll-fade" />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-fade {
            0%, 100% {
              opacity: 0;
              transform: translateY(-8px);
            }
            50% {
              opacity: 1;
              transform: translateY(8px);
            }
          }
          .animate-scroll-fade {
            animation: scroll-fade 2s ease-in-out 3;
          }
        `
      }} />
    </section>
  );
};

export default Hero;