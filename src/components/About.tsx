import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lightbulb, Handshake, Target, Zap, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Technologies modernes pour des solutions performantes et durables.',
  },
  {
    icon: Handshake,
    title: 'Engagement Client',
    description: 'Votre satisfaction et réussite au cœur de chaque projet.',
  },
  {
    icon: Target,
    title: 'Qualité',
    description: 'Produits fiables, testés et optimisés pour des performances maximales.',
  },
  {
    icon: Zap,
    title: 'Efficacité',
    description: 'Rapidité, organisation et respect des délais.',
  },
  {
    icon: Shield,
    title: 'Fiabilité',
    description: 'Relations basées sur la confiance et la transparence.',
  },
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate mission/vision cards
      gsap.fromTo(
        '.about-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-cards',
            start: 'top 80%',
          },
        }
      );

      // Animate values
      gsap.fromTo(
        '.value-item',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.values-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding bg-background relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(217_91%_53%_/_0.08)_0%,_transparent_60%)]" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-sm font-medium text-primary uppercase tracking-widest mb-4">
            À Propos
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Notre <span className="text-gradient">ADN</span>
          </h2>
        </div>

        {/* Mission & Vision Cards */}
        <div className="about-cards grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Mission */}
          <div className="about-card card-premium p-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-8">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">Notre Mission</h3>
            <p className="font-body text-muted-foreground leading-relaxed text-lg">
              Concevoir des solutions web sur mesure afin d'améliorer la performance des entreprises 
              et d'offrir aux particuliers des outils digitaux pratiques, rapides et efficaces.
            </p>
          </div>

          {/* Vision */}
          <div className="about-card card-premium p-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-8">
              <Lightbulb className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">Notre Vision</h3>
            <p className="font-body text-muted-foreground leading-relaxed text-lg">
              Révolutionner la manière dont les entreprises et les particuliers utilisent le web, 
              en proposant des solutions digitales intelligentes, accessibles et innovantes.
            </p>
          </div>
        </div>

        {/* Unique Value Proposition */}
        <div className="text-center mb-16 p-12 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Proposition de Valeur Unique
          </h3>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nous vous offrons un <span className="text-primary font-semibold">travail de qualité Premium</span> dans 
            un <span className="text-secondary font-semibold">délai extrêmement court</span>. 
            Libérez-vous de l'esclavage de votre propre structure grâce à la digitalisation.
          </p>
        </div>

        {/* Values Grid */}
        <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="value-item p-6 rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                {value.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
