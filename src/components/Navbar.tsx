import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power1.out',
          delay: 0
        }
      );
    }
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.to(menuRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: 'power1.out',
        });
      } else {
        gsap.to(menuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.1,
          ease: 'power1.in',
        });
      }
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'ACCUEIL', href: '#hero' },
    { name: 'PROBLÈMES', href: '#problems' },
    { name: 'SERVICES', href: '#services' },
    { name: 'RÉALISATIONS', href: '#realisations' },
    { name: 'À PROPOS', href: '#about' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
          isScrolled ? 'bg-background/80 backdrop-blur-2xl' : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-center h-20">
            {/* Centered Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-12 h-12 flex flex-col items-center justify-center gap-2 group"
              aria-label="Toggle menu"
            >
              <span
                className={`w-8 h-0.5 bg-foreground transition-all duration-150 ${
                  isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
                }`}
              />
              <span
                className={`w-8 h-0.5 bg-foreground transition-all duration-150 ${
                  isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl flex items-center justify-center transition-all duration-100 ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-8">
          {/* Logo at top */}
          <div className="mb-8">
            <img
              src="/logos/logo_final.png"
              alt="TechForge Solution 237"
              className="h-16 w-auto opacity-80"
            />
          </div>

          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl md:text-4xl font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-150"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;