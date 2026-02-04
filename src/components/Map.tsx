import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Navigation } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Map = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.map-content',
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

  // Plus Code VG26+3W Yaoundé corresponds to approximately:
  // Latitude: 3.8672, Longitude: 11.5139
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1990.3845!2d11.5130!3d3.8672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7b2b2b2b2b%3A0x2b2b2b2b2b2b2b2b!2sVG26%2B3W%20Yaound%C3%A9!5e0!3m2!1sfr!2scm!4v1700000000000!5m2!1sfr!2scm";
  
  const googleMapsDirectUrl = "https://www.google.com/maps/place/VG26%2B3W+Yaound%C3%A9/@3.8672,11.5130,18z";

  return (
    <section
      id="location"
      ref={sectionRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="container-custom">
        <div className="map-content">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">
              Notre localisation
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Où nous trouver
            </h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Yaoundé, Cameroun - VG26+3W (Quartier Ambassade de France)</span>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative rounded-3xl overflow-hidden border border-border/30 shadow-2xl">
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="500"
              style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(90%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="TechForge Solution 237 Location"
            />
            
            {/* Overlay Info Card */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-sm">
              <div className="card-premium p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Tech Forge Solution </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      VG26+3W Yaoundé, Cameroun<br />
                      Quartier Ambassade de France
                    </p>
                    <a 
                      href={googleMapsDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
                    >
                      <Navigation className="w-4 h-4" />
                      Ouvrir dans Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
