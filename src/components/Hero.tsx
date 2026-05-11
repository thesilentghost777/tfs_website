import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const [currentOption, setCurrentOption] = useState(0);

  // Options de texte optimisées pour le marketing
  const options = [
    {
      title: 'Sites web & applications',
      fullTitle: 'Nous concevons des ',
      highlight: 'Solutions sur mesure',
      description: "Nous créons des sites web et des applications web & mobiles sur mesure. Nous sommes spécialisés dans les logiciels de gestion pour booster votre activité."
    },
    {
      title: 'Libérez votre',
      fullTitle: 'Libérez votre temps précieux',
      highlight: 'temps précieux',
      description: "Nous concevons des solutions digitales sur mesure pour accélérer votre gestion (inventaire, comptabilité, statistiques) et vous redonner le contrôle de votre temps."
    },
    {
      title: 'Contrôlez totalement',
      fullTitle: 'Contrôlez totalement votre business',
      highlight: 'votre business',
      description: "Nous proposons des outils de supervision en temps réel pour piloter vos entreprises et prendre les bonnes décisions stratégiques, où que vous soyez."
    },
    {
      title: 'Automatisez vos',
      fullTitle: 'Automatisez vos tâches répétitives',
      highlight: 'tâches répétitives',
      description: "Nous créons des logiciels qui automatisent intelligemment les tâches chronophages, libérant vos équipes pour des missions à plus forte valeur ajoutée."
    },
    {
      title: 'Sécurisez vos',
      fullTitle: 'Réduisez les possibilités ',
      highlight: 'de vol',
      description: "Nous proposons des solutions logicielles qui tracent et sécurisent chaque action, réduisant considérablement les risques de détournement interne."
    }
  ];

  // Rotation automatique des options - 10 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOption((prev) => (prev + 1) % options.length);
    }, 10000); // Changé à 10000ms

    return () => clearInterval(interval);
  }, []);

  // Animation GSAP
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

  // Animation de transition pour le texte
  useEffect(() => {
    if (titleRef.current && subtitleRef.current) {
      gsap.to([titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          // Mise à jour du texte
          if (titleRef.current && subtitleRef.current) {
            gsap.set([titleRef.current, subtitleRef.current], {
              opacity: 0,
              y: 20
            });
            
            gsap.to([titleRef.current, subtitleRef.current], {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out'
            });
          }
        }
      });
    }
  }, [currentOption]);

  // Fonction pour afficher le titre avec le mot en bleu
  const renderTitle = () => {
    const current = options[currentOption];
    const parts = current.fullTitle.split(current.highlight);
    
    return (
      <>
        {parts[0]}
        <span className="text-gradient">{current.highlight}</span>
        {parts[1]}
      </>
    );
  };

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
      <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 md:left-32 md:translate-x-0 z-20">
        <img 
          src="/logos/logo_final.png" 
          alt="TechForge Solution 237" 
          className="h-12 md:h-20 w-auto opacity-90"
        />
      </div>

      <div className="relative z-10 container-custom px-4 pt-32 md:pt-24">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge - Optimisé pour mobile */}
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2 rounded-full border border-border bg-muted/30 backdrop-blur-sm mb-8 md:mb-10">
            <span className="text-xs md:text-sm font-medium tracking-wide uppercase text-muted-foreground">
              Forge à solution sur mesure
            </span>
          </div>

          {/* Title avec animation */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1] mb-6 md:mb-8 tracking-tight min-h-[120px] md:min-h-[160px] flex items-center justify-center"
          >
            <span className="block">{renderTitle()}</span>
          </h1>

          {/* Subtitle avec animation */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed min-h-[80px] md:min-h-[60px] flex items-center justify-center"
          >
            {options[currentOption].description}
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-4">
            <a href="#contact" className="btn-primary w-full sm:w-auto">
              Travaillons ensemble
            </a>
            <a href="#realisations" className="btn-outline w-full sm:w-auto">
              Voir nos réalisations
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-24 pt-10 md:pt-12 border-t border-border/30">
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