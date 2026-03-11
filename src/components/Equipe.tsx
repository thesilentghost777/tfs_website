import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Images dans public/admin — adaptez les noms et rôles
const team = [
  { src: '/admin/admin1.png', name: 'Yannick NINLA', role: 'CEO & Co-Fondateur', linkedin: '#' },
  { src: '/admin/admin2.jpeg', name: 'Wilfried SIGNE', role: 'CTO & Co-Fondateur', linkedin: '#' },
  { src: '/admin/admin3.png', name: 'Victor OMGBA', role: 'Responsable Marketing et communication', linkedin: '#' },
  { src: '/admin/admin4.png', name: 'Daniella MEFFO', role: 'Secretaire', linkedin: '#' },
  { src: '/admin/admin5.png', name: 'Stella KOUASSI', role: 'Responsable RH', linkedin: '#' },
  { src: '/admin/admin6.png', name: 'Anabelle Toussi', role: 'Community Manager', linkedin: '#' },
];

const Equipe = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.equipe-title', { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });

      gsap.fromTo('.team-card', { opacity: 0, y: 60, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1,
        stagger: { amount: 0.8, from: 'start' },
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.team-grid', start: 'top 78%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="equipe"
      ref={sectionRef}
      className="py-20 md:py-32 bg-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(217_91%_53%_/_0.04)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="equipe-title text-center mb-14 md:mb-20">
          <span className="inline-block text-xs md:text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
            Notre Équipe
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Les artisans du digital
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mt-4">
            Une équipe passionnée, expérimentée, et dédiée à transformer vos idées en réalité.
          </p>
        </div>

        {/* Grid */}
        <div className="team-grid grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className="team-card group relative rounded-2xl overflow-hidden card-glass"
              style={{ aspectRatio: '3/4' }}
            >
              {/* Photo */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-muted/20 transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${member.src})` }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-semibold text-sm md:text-base lg:text-lg leading-tight">
                  {member.name}
                </h3>
                <p className="text-primary text-xs md:text-sm mt-1 font-medium">
                  {member.role}
                </p>
                
              </div>

              {/* Index badge */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4">
                <span className="text-[10px] font-mono text-white/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-muted-foreground text-sm mb-4">
            Vous voulez rejoindre l'aventure ?
          </p>
          <a
            href={`https://wa.me/237696087354?text=${encodeURIComponent("Bonjour, je suis intéressé(e) par rejoindre l'équipe Tech Forge Solutions.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
};

export default Equipe;