import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    title: "Esclave de mon entreprise",
    description: "Je suis devenu esclave de ma propre entreprise, je n'arrive plus à me libérer des tâches comme la correction des fiches, la comptabilité élémentaire, la gestion des stocks, le contrôle des actions.",
    image: "testimonies/t1.png"
  },
  {
    title: "Processus répétitifs",
    description: "J'ai une entreprise qui a un processus métier qui est répétitif mais je ne sais pas comment automatiser tout cela.",
    image: "testimonies/t2.png"
  },
  {
    title: "Idée d'application",
    description: "J'ai une idée d'une application web ou mobile et j'aimerais que mon projet prenne vie.",
    image: "testimonies/t3.png"
  },
  {
    title: "Besoin de visibilité",
    description: "Nous voulons présenter nos produits et services mais nous n'avons pas un site web professionnel.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
];

const Problems = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.problem-title',
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

      gsap.fromTo(
        '.problem-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.problems-grid',
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="problems"
      ref={sectionRef}
      className="section-padding bg-background relative overflow-hidden"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="problem-title text-center mb-20">
          <span className="inline-block text-sm font-medium text-primary uppercase tracking-[0.2em] mb-6">
            Vos défis
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Vous vous reconnaissez ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ces problèmes sont ceux de nombreux entrepreneurs. Nous avons les solutions.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="problems-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="problem-card card-glass p-8 md:p-10 group hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="flex items-start gap-6">
                {/* Client Image */}
                <div className="flex-shrink-0">
                  <img
                    src={problem.image}
                    alt="Client"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-border/50 group-hover:border-primary/50 transition-colors duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                    "{problem.title}"
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;
