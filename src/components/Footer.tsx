import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Facebook, Youtube, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/thesilentghost777', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  const footerLinks = [
    {
      title: 'SERVICES',
      links: [
        { name: 'SITES WEB', href: '#services' },
        { name: 'APPLICATIONS WEB', href: '#services' },
        { name: 'APPLICATIONS MOBILE', href: '#services' },
        { name: 'E-COMMERCE', href: '#services' },
      ],
    },
    {
      title: 'ENTREPRISE',
      links: [
        { name: 'À PROPOS', href: '#about' },
        { name: 'RÉALISATIONS', href: '#realisations' },
        { name: 'TECHNOLOGIES', href: '#technologies' },
        { name: 'CONTACT', href: '#contact' },
      ],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate footer elements on scroll
      gsap.fromTo(
        '.footer-content',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );

      // Animate social icons
      gsap.fromTo(
        '.social-icon',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: '.social-links',
            start: 'top 90%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-background border-t border-border/30">
      <div className="container-custom py-16">
        <div className="footer-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#hero" className="flex items-center gap-4 mb-8">
              <img 
                src="/logos/logo_final.png" 
                alt="TechForge Solution 237" 
                className="h-14 w-auto"
              />
            </a>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed uppercase tracking-wide text-sm">
              AGENCE DIGITALE PREMIUM SPÉCIALISÉE DANS LA CRÉATION DE SOLUTIONS WEB ET MOBILES 
              SUR MESURE. BASÉE AU CAMEROUN, NOUS ACCOMPAGNONS LES ENTREPRISES DANS LEUR 
              TRANSFORMATION DIGITALE.
            </p>
            
            {/* Social Links */}
            <div className="social-links flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon w-12 h-12 rounded-full border border-border/50 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-sm tracking-[0.2em] mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground tracking-wide uppercase">
            © {currentYear} TECHFORGE SOLUTION 237. TOUS DROITS RÉSERVÉS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
