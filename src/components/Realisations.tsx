import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, ChevronLeft, ChevronRight, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'EasyGest BP',
    category: 'Apps Web&mobile',
    description: 'Solution complète de gestion pour boulangeries et pâtisseries.',
    url: 'https://easygestbp.techforgesolution237.site/easygest-bp',
    featured: true,
    tags: ['React','React Native', 'Laravel', 'postgresql', 'tailwind', 'API REST', 'alpine.js', 'pwa'],
    image: 'realisations/r1.png',
  },
  {
    title: 'EasyGest Booster',
    category: 'Apps Web',
    description: 'Solution pour booster l\'engagement dans les differents reseaux sociaux.',
    url: 'https://egbooster.techforgesolution237.site/',
    featured: true,
    tags: ['React','Laravel', 'postgresql', 'tailwind', 'API REST', 'alpine.js', 'pwa'],
    image: 'realisations/r7.png',
  },
  {
    title: 'Ange Raphael Auto Ecole',
    category: 'Apps mobile',
    description: "Application mobile de suivi des cours d'auto école.",
    url: 'https://ange-raphael.supahuman.site/ange-raphael',
    tags: ['React Native','Laravel', 'Alpine.js','postgresql','redis'],
    image: 'realisations/r4.png',
  },
   {
    title: 'Agri Connect',
    category: 'Apps Mobile',
    description: 'Solution pour la gestion agricole , détection des maladies des plantes , suivi en temps reel des prix du marché pour les acteurs agricoles.',
    url: 'https://techforgesolution237.site/agriconnect.html',
    featured: true,
    tags: ['React Native','Laravel', 'postgresql', 'tailwind', 'API REST', 'alpine.js', 'pwa'],
    image: 'realisations/r8.png',
  },
  {
    title: 'CFPAM group',
    category: 'Sites Web',
    description: "Site institutionnel pour un groupe de centres de formation.",
    url: 'https://cfpamnetwork.net',
    tags: ['React JS', 'Tailwind'],
    image: 'realisations/r3.png',
  },
  {
    title: 'Elite 2.0',
    category: 'Apps Mobile',
    description: 'Application éducative et de suivi scolaire.',
    url: 'https://elite.supahuman.site/project_elite_tfs237',
    tags: ['React Native', 'API REST', 'Laravel','postgresql','redis'],
    image: 'realisations/r2.png',
  },
  {
    title: 'La maison des teckels',
    category: 'Sites Web',
    description: 'Plateforme e-commerce pour la vente de chiots de race en France.',
    url: 'https://lamaisondesteckels.com',
    tags: ['Blade', 'Laravel', 'mySQL', 'Tailwind', 'Scss', 'pwa'],
    image: 'realisations/r5.png',
  },
 
  {
    title: 'Business Room',
    category: 'Apps Mobile',
    description: 'Application de tontines.',
    url: 'https://nkapdey.supahuman.site/nkap-d',
    tags: ['React Native', 'API REST', 'Laravel','postgresql','redis'],
    image: 'realisations/r6.png',
  },
  
];

const Realisations = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.realisations-header',
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

    return () => ctx.revert();
  }, []);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="realisations"
      ref={sectionRef}
      className="section-padding bg-background-secondary relative overflow-hidden"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="realisations-header text-center mb-16">
          <span className="inline-block text-sm font-medium text-primary uppercase tracking-[0.2em] mb-6">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Nos réalisations vedettes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez quelques-uns des projets qui ont transformé les activités de nos clients.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Carousel */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projects.map((project, index) => (
                <a
                  key={project.title}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex-shrink-0 group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mx-2">
                    {/* Background Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay - Plus prononcé sur mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 md:via-background/60 to-transparent" />
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary text-primary-foreground text-xs md:text-sm font-medium">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                        <span className="hidden sm:inline">Top Projet</span>
                        <span className="sm:hidden">Top</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                      <span className="inline-block text-xs md:text-sm font-medium text-primary uppercase tracking-wider mb-2 md:mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 max-w-xl line-clamp-2">
                        {project.description}
                      </p>
                      
                      {/* Tags - Hidden on mobile, visible on tablet+ */}
                      <div className="hidden md:flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 rounded-full bg-muted/50 backdrop-blur text-muted-foreground text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base">
                        Voir le projet
                        <ExternalLink className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Realisations;