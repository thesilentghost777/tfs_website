import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const localImages = [
  { src: '/locaux/local0.png', caption: 'Entrée', label: 'Entrée' },
  { src: '/locaux/local1.png', caption: '', label: '' },
  { src: '/locaux/local2.png', caption: 'Accueil', label: 'Reception desk' },
  { src: '/locaux/local3.png', caption: "Espace d'attente client", label: 'Customer Waiting Area' },
  { src: '/locaux/local5.png', caption: 'Parking', label: 'Parking' },
];

type Transition = 'slide-left' | 'zoom-in' | 'fade-blur' | 'curtain' | 'shatter';
const transitions: Transition[] = ['slide-left', 'zoom-in', 'fade-blur', 'curtain', 'shatter'];

// Cinematic overlay: light vignette + grain + bottom gradient for text
const CinematicOverlay = () => (
  <>
    {/* Vignette — centre net, bords sombres */}
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background:
          'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.72) 100%)',
      }}
    />
    {/* Gradient bas pour le texte */}
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 28%, transparent 52%)',
      }}
    />
    {/* Gradient haut léger */}
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, transparent 28%)',
      }}
    />
    {/* Grain de film — visible mais pas oppressant */}
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        opacity: 0.12,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '180px 180px',
        mixBlendMode: 'screen',
      }}
    />
    {/* Teinte bleue froide — color grade cinéma */}
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background: 'linear-gradient(160deg, rgba(10,22,60,0.18) 0%, rgba(0,8,24,0.22) 100%)',
        mixBlendMode: 'multiply',
      }}
    />
    {/* Letterbox bars cinéma */}
    <div className="absolute top-0 left-0 right-0 h-[6px] bg-black z-20 pointer-events-none" />
    <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-black z-20 pointer-events-none" />
  </>
);

interface SlideProps {
  image: (typeof localImages)[0];
  divRef?: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
  className?: string;
}

const Slide = ({ image, divRef, style, className = '' }: SlideProps) => (
  <div
    ref={divRef}
    className={`absolute inset-0 ${className}`}
    style={{ ...style }}
  >
    {/* Image layer avec filtre cinéma fixe */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${image.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.78) saturate(0.68) contrast(1.1)',
      }}
    />
    <CinematicOverlay />
    {/* Label + caption */}
    <div className="absolute bottom-8 left-8 md:bottom-10 md:left-12 z-20">
      <span
        className="block mb-2 text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em]"
        style={{ color: '#7eb8e0', letterSpacing: '0.3em' }}
      >
        {image.label}
      </span>
      <p
        className="text-white font-light text-xl md:text-3xl lg:text-4xl"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif", textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
      >
        {image.caption}
      </p>
    </div>
  </div>
);

const Locaux = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  // We keep TWO fixed layer refs — A (bottom) and B (top)
  // We always animate B on top of A, then swap which image each shows
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // currentImg / nextImg track what each layer is displaying
  const [layerAImg, setLayerAImg] = useState(0); // visible layer
  const [layerBImg, setLayerBImg] = useState(1); // staging layer
  const [visibleLayer, setVisibleLayer] = useState<'A' | 'B'>('A');
  const [displayIdx, setDisplayIdx] = useState(0); // for UI dots/counter

  const isAnimatingRef = useRef(false);
  const transitionIdxRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const displayIdxRef = useRef(0);

  const runTransition = useCallback(
    (nextImageIdx: number, transType: Transition) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const isAVisible = visibleLayer === 'A';
      const frontRef = isAVisible ? layerARef : layerBRef;
      const backRef = isAVisible ? layerBRef : layerARef;

      if (!frontRef.current || !backRef.current) {
        isAnimatingRef.current = false;
        return;
      }

      // Pre-position the incoming layer BEFORE making it visible
      const front = frontRef.current;
      const back = backRef.current;

      // Update the hidden (back) layer's image state before animation
      if (isAVisible) {
        setLayerBImg(nextImageIdx);
      } else {
        setLayerAImg(nextImageIdx);
      }

      // Small delay to let React render the new background before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Front is fully visible, back starts hidden
          gsap.set(front, { opacity: 1, x: 0, y: 0, xPercent: 0, scale: 1, filter: 'none', rotationY: 0, autoAlpha: 1, zIndex: 1 });
          gsap.set(back, { opacity: 0, x: 0, y: 0, xPercent: 0, scale: 1, filter: 'none', rotationY: 0, autoAlpha: 0, zIndex: 2 });

          const tl = gsap.timeline({
            onComplete: () => {
              setVisibleLayer(isAVisible ? 'B' : 'A');
              setDisplayIdx(nextImageIdx);
              displayIdxRef.current = nextImageIdx;
              // Reset both to clean state: new front (back) fully visible, old front hidden
              gsap.set(back, { opacity: 1, autoAlpha: 1, x: 0, xPercent: 0, scale: 1, filter: 'none', rotationY: 0, zIndex: 2 });
              gsap.set(front, { opacity: 0, autoAlpha: 0, x: 0, xPercent: 0, scale: 1, filter: 'none', rotationY: 0, zIndex: 1 });
              isAnimatingRef.current = false;
            },
          });

          switch (transType) {
            case 'slide-left':
              gsap.set(back, { xPercent: 100, autoAlpha: 1 });
              tl.to(front, { xPercent: -100, duration: 1.0, ease: 'power3.inOut' }, 0).to(
                back,
                { xPercent: 0, duration: 1.0, ease: 'power3.inOut' },
                0,
              );
              break;

            case 'zoom-in':
              gsap.set(back, { scale: 1.15, autoAlpha: 0 });
              tl.to(front, { scale: 0.92, autoAlpha: 0, duration: 0.85, ease: 'power2.inOut' }, 0).to(
                back,
                { scale: 1, autoAlpha: 1, duration: 0.85, ease: 'power2.out' },
                0.1,
              );
              break;

            case 'fade-blur':
              gsap.set(back, { autoAlpha: 0, filter: 'blur(20px)' });
              tl.to(front, { autoAlpha: 0, filter: 'blur(20px)', duration: 0.7, ease: 'power2.out' }, 0).to(
                back,
                { autoAlpha: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
                0.15,
              );
              break;

            case 'curtain':
              gsap.set(back, { clipPath: 'inset(0 100% 0 0)', autoAlpha: 1 });
              tl.to(back, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power4.inOut' }, 0).to(
                front,
                { autoAlpha: 0, duration: 0.25, ease: 'power2.in' },
                0.85,
              );
              break;

            case 'shatter':
              gsap.set(back, { autoAlpha: 0, rotationY: -20, transformOrigin: 'left center', transformPerspective: 1200 });
              tl.to(
                front,
                { rotationY: 20, autoAlpha: 0, transformOrigin: 'right center', transformPerspective: 1200, duration: 0.85, ease: 'power3.inOut' },
                0,
              ).to(back, { autoAlpha: 1, rotationY: 0, duration: 0.85, ease: 'power3.out' }, 0.15);
              break;
          }
        });
      });
    },
    [visibleLayer],
  );

  const advance = useCallback(() => {
    const nextIdx = (displayIdxRef.current + 1) % localImages.length;
    const trans = transitions[transitionIdxRef.current % transitions.length];
    transitionIdxRef.current += 1;
    runTransition(nextIdx, trans);
  }, [runTransition]);

  const goToIdx = useCallback(
    (idx: number) => {
      if (idx === displayIdxRef.current || isAnimatingRef.current) return;
      if (intervalRef.current) clearInterval(intervalRef.current);
      const trans = transitions[transitionIdxRef.current % transitions.length];
      transitionIdxRef.current += 1;
      runTransition(idx, trans);
      intervalRef.current = setInterval(advance, 5000);
    },
    [runTransition, advance],
  );

  const goPrev = useCallback(() => {
    const prevIdx = (displayIdxRef.current - 1 + localImages.length) % localImages.length;
    goToIdx(prevIdx);
  }, [goToIdx]);

  const goNext = useCallback(() => {
    const nextIdx = (displayIdxRef.current + 1) % localImages.length;
    goToIdx(nextIdx);
  }, [goToIdx]);

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(advance, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [advance]);

  // Progress bar
  useEffect(() => {
    if (!progressRef.current) return;
    gsap.killTweensOf(progressRef.current);
    gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: 5, ease: 'none' });
  }, [displayIdx]);

  // Scroll reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.locaux-title',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } },
      );
      gsap.fromTo(
        '.locaux-stage',
        { opacity: 0, y: 80, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: '.locaux-stage', start: 'top 85%' } },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="locaux"
      ref={sectionRef}
      className="py-20 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_hsl(217_91%_53%_/_0.05)_0%,_transparent_50%)]" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="locaux-title text-center mb-14">
          <span className="inline-block text-xs md:text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
            Nos Locaux
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Là où la magie opère
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mt-4">
            Des espaces pensés pour l'innovation, la collaboration et l'excellence.
          </p>
        </div>

        {/* Stage */}
        <div className="locaux-stage relative mx-auto max-w-5xl">
          {/* Main slideshow */}
          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
              aspectRatio: '16/9',
              perspective: '1200px',
              backgroundColor: '#000',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Layer A */}
            <Slide
              image={localImages[layerAImg]}
              divRef={layerARef as React.RefObject<HTMLDivElement>}
              style={{ zIndex: visibleLayer === 'A' ? 2 : 1 }}
            />

            {/* Layer B */}
            <Slide
              image={localImages[layerBImg]}
              divRef={layerBRef as React.RefObject<HTMLDivElement>}
              style={{ zIndex: visibleLayer === 'B' ? 2 : 1, opacity: 0 }}
            />

            {/* Slide counter — top layer */}
            <div className="absolute top-5 right-5 z-30">
              <span className="text-[11px] text-white/50 font-mono tracking-widest">
                {String(displayIdx + 1).padStart(2, '0')}
                <span className="text-white/25 mx-1">/</span>
                {String(localImages.length).padStart(2, '0')}
              </span>
            </div>

            {/* Nav arrows */}
            <button
              onClick={goPrev}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
              aria-label="Précédent"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
              aria-label="Suivant"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-[2px] bg-border/30 rounded-full overflow-hidden">
            <div ref={progressRef} className="h-full bg-primary origin-left rounded-full" style={{ transform: 'scaleX(0)' }} />
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {localImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIdx(idx)}
                aria-label={`Photo ${idx + 1}`}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  idx === displayIdx ? 'bg-primary w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
                }`}
              />
            ))}
          </div>

          {/* Thumbnails */}
          <div className="hidden md:grid grid-cols-5 gap-3 mt-6">
            {localImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goToIdx(idx)}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                  idx === displayIdx ? 'ring-2 ring-primary ring-offset-2 ring-offset-background opacity-100' : 'opacity-35 hover:opacity-65'
                }`}
                style={{ aspectRatio: '16/9' }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${img.src})`, filter: 'brightness(0.75) saturate(0.8)' }}
                />
                {/* Mini vignette on thumbs */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)' }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locaux;