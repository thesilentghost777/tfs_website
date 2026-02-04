import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Technology logos using official logos from CDN
const technologies = [
  { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'React Native', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Laravel', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
  { name: 'Flask', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
  { name: 'Tailwind CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Alpine.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/alpinejs/alpinejs-original.svg' },
  { name: 'SCSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg' },
  { name: 'HTML5', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Hostinger', logo: 'https://cdn.simpleicons.org/hostinger/673DE6' },
  { name: 'Cloudflare', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg' },
];

const Technologies = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.tech-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Stagger animation for tech items
      gsap.fromTo(
        '.tech-logo-item',
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.tech-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="technologies"
      ref={sectionRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(217_91%_53%_/_0.03)_0%,_transparent_50%)]" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="tech-header text-center mb-16">
          <span className="inline-block text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
            Stack Technologique
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Écosystème & <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Les technologies modernes que nous maîtrisons pour créer vos solutions.
          </p>
        </div>

        {/* Logos Grid */}
        <div className="tech-grid grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 md:gap-6 max-w-5xl mx-auto">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="tech-logo-item group relative aspect-square flex flex-col items-center justify-center p-4 rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
            >
              {/* Logo Image */}
              <div className="w-12 h-12 md:w-14 md:h-14 mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img 
                  src={tech.logo} 
                  alt={`${tech.name} logo`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Name */}
              <span className="text-xs text-center text-muted-foreground group-hover:text-primary transition-colors font-medium leading-tight">
                {tech.name}
              </span>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;