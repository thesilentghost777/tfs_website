import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HourglassAnimation = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const topSandRef = useRef<SVGRectElement>(null);
  const bottomSandRef = useRef<SVGRectElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);
  const mobileTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sand animation controlled by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Top sand decreases (from full to empty)
      tl.to(topSandRef.current, {
        attr: { height: 0, y: 130 },
        ease: 'none',
      }, 0);

      // Bottom sand increases (from empty to full)
      tl.to(bottomSandRef.current, {
        attr: { height: 100 },
        ease: 'none',
      }, 0);

      // Desktop text animations - fade in from sides
      tl.fromTo(
        textLeftRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.3 },
        0.3
      );

      tl.fromTo(
        textRightRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.3 },
        0.4
      );

      // Mobile text animation - fade in from bottom
      tl.fromTo(
        mobileTextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4 },
        0.5
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-background overflow-hidden flex items-center justify-center"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(217_91%_53%_/_0.05)_0%,_transparent_70%)]" />

      {/* Main content container */}
      <div className="relative flex items-center justify-center gap-8 md:gap-16 lg:gap-24 w-full max-w-7xl px-4">
        
        {/* Left Text */}
        <div 
          ref={textLeftRef}
          className="hidden md:block text-right max-w-xs lg:max-w-sm opacity-0"
        >
          <p className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight">
            <span className="text-gradient">Sur quel projet</span>
          </p>
          <p className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-foreground">
            allez-vous vous
          </p>
          <p className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-foreground">
            consacrer
          </p>
        </div>

        {/* Hourglass SVG */}
        <div className="relative flex-shrink-0">
          <svg
            width="180"
            height="320"
            viewBox="0 0 200 350"
            className="drop-shadow-[0_0_60px_hsl(217_91%_53%_/_0.3)]"
          >
            {/* Glass outer frame */}
            <defs>
              <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(0, 0%, 40%)" />
                <stop offset="50%" stopColor="hsl(0, 0%, 25%)" />
                <stop offset="100%" stopColor="hsl(0, 0%, 15%)" />
              </linearGradient>
              <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                <stop offset="100%" stopColor="hsl(217, 91%, 40%)" />
              </linearGradient>
              <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(0, 0%, 50%)" />
                <stop offset="50%" stopColor="hsl(0, 0%, 30%)" />
                <stop offset="100%" stopColor="hsl(0, 0%, 20%)" />
              </linearGradient>
              <clipPath id="topBulb">
                <path d="M 40 30 Q 40 130, 100 140 Q 160 130, 160 30 L 160 30 L 40 30 Z" />
              </clipPath>
              <clipPath id="bottomBulb">
                <path d="M 40 320 Q 40 220, 100 210 Q 160 220, 160 320 L 160 320 L 40 320 Z" />
              </clipPath>
            </defs>

            {/* Top frame */}
            <rect x="25" y="8" width="150" height="18" rx="5" fill="url(#frameGradient)" />
            
            {/* Bottom frame */}
            <rect x="25" y="324" width="150" height="18" rx="5" fill="url(#frameGradient)" />

            {/* Glass body outline */}
            <path
              d="M 40 25 
                 Q 40 130, 100 175 
                 Q 160 130, 160 25
                 M 40 325 
                 Q 40 220, 100 175 
                 Q 160 220, 160 325"
              fill="none"
              stroke="hsl(0, 0%, 35%)"
              strokeWidth="3"
            />

            {/* Top sand (decreases with scroll) */}
            <g clipPath="url(#topBulb)">
              <rect
                ref={topSandRef}
                x="45"
                y="30"
                width="110"
                height="100"
                fill="url(#sandGradient)"
                className="transition-none"
              />
            </g>

            {/* Sand stream (middle) */}
            <line
              x1="100"
              y1="145"
              x2="100"
              y2="205"
              stroke="hsl(217, 91%, 50%)"
              strokeWidth="3"
              opacity="0.8"
            />

            {/* Bottom sand (increases with scroll) */}
            <g clipPath="url(#bottomBulb)">
              <rect
                ref={bottomSandRef}
                x="45"
                y="220"
                width="110"
                height="0"
                fill="url(#sandGradient)"
                className="transition-none"
              />
            </g>

            {/* Glass reflections */}
            <path
              d="M 55 40 Q 55 110, 90 150"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.1"
            />
            <path
              d="M 145 40 Q 145 110, 110 150"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.05"
            />
          </svg>
        </div>

        {/* Right Text */}
        <div 
          ref={textRightRef}
          className="hidden md:block text-left max-w-xs lg:max-w-sm opacity-0"
        >
          <p className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-foreground">
            avec le temps
          </p>
          <p className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-foreground">
            que vous allez
          </p>
          <p className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight">
            <span className="text-gradient">liberer ?</span>
          </p>
        </div>
      </div>

      {/* Mobile Text - Below hourglass */}
      <div 
        ref={mobileTextRef}
        className="md:hidden absolute bottom-20 left-0 right-0 text-center px-6 opacity-0"
      >
        <p className="text-xl font-bold leading-relaxed">
          <span className="text-gradient">Sur quel projet</span>
          <span className="text-foreground"> allez-vous vous consacrer </span>
          <span className="text-foreground">avec le temps que vous allez </span>
          <span className="text-gradient">liberer ?</span>
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-primary/40 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/6 w-2 h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
    </section>
  );
};

export default HourglassAnimation;