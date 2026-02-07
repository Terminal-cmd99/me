import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, MapPin, Calendar, CheckSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    if (!section || !content || !image) return;

    const ctx = gsap.context(() => {
      // Image entrance
      gsap.fromTo(
        image,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'steps(8)',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content entrance
      gsap.fromTo(
        content,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'steps(8)',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const responsibilities = ['desc1', 'desc2', 'desc3', 'desc4'];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center py-20"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="heading-lg text-white inline-block relative">
            {t('experience.heading') as string}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#ff6b9d]" />
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div ref={contentRef}>
            <div 
              className="relative p-8"
              style={{
                background: 'rgba(26, 26, 62, 0.95)',
                border: '4px solid #6b4ee6',
                boxShadow: '8px 8px 0 #ff6b9d',
              }}
            >
              {/* Pixel corners */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#ffd700]" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#ffd700]" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#ffd700]" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#ffd700]" />

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-8 h-8 flex items-center justify-center"
                    style={{
                      background: '#6b4ee6',
                      boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
                    }}
                  >
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-retro text-lg text-[#00d4ff]">
                    {t('experience.role') as string}
                  </span>
                </div>
                
                <h3 className="font-pixel text-sm text-white mb-3">
                  {t('experience.company') as string}
                </h3>
                
                <div className="flex flex-wrap items-center gap-4 font-retro text-lg text-[#a0a0c0]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#ff6b9d]" />
                    <span>{t('experience.location') as string}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00d4ff]" />
                    <span>{t('experience.period') as string}</span>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <ul className="space-y-3">
                {responsibilities.map((desc) => (
                  <li
                    key={desc}
                    className="flex items-start gap-3"
                  >
                    <CheckSquare className="w-5 h-5 text-[#ffd700] flex-shrink-0 mt-1" />
                    <span className="font-retro text-lg text-[#c0c0e0]">
                      {t(`experience.${desc}`) as string}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Pixel glow */}
              <div 
                className="absolute inset-0 scale-105"
                style={{
                  background: 'linear-gradient(135deg, #ff6b9d 0%, #6b4ee6 100%)',
                  filter: 'blur(15px)',
                  opacity: 0.4,
                }}
              />
              
              {/* Image with retro border */}
              <div 
                className="relative aspect-[3/4]"
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  border: '4px solid #ff6b9d',
                  boxShadow: '8px 8px 0 #6b4ee6, 16px 16px 0 rgba(255, 107, 157, 0.2)',
                }}
              >
                <img
                  src="/me-working.png"
                  alt="Experience"
                  className="w-full h-full object-cover object-top"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
