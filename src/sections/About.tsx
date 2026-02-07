import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const education = educationRef.current;
    if (!section || !image || !content || !education) return;

    const ctx = gsap.context(() => {
      // Image entrance
      gsap.fromTo(
        image,
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

      // Content entrance
      gsap.fromTo(
        content,
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

      // Education entrance
      gsap.fromTo(
        education,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.2,
          ease: 'steps(8)',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center py-20"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="heading-lg text-white inline-block relative">
            {t('about.heading') as string}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#6b4ee6]" />
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <div ref={imageRef} className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Pixel glow */}
              <div 
                className="absolute inset-0 scale-105"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff 0%, #6b4ee6 100%)',
                  filter: 'blur(15px)',
                  opacity: 0.4,
                }}
              />
              
              {/* Image with retro border */}
              <div 
                className="relative w-[280px] md:w-[320px] aspect-[3/4]"
                style={{
                  boxShadow: '6px 6px 0 #00d4ff, 12px 12px 0 rgba(107, 78, 230, 0.3)',
                  border: '4px solid #6b4ee6',
                }}
              >
                <img
                  src="/me-standing.png"
                  alt="About"
                  className="w-full h-full object-cover object-top"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div ref={contentRef}>
              <p className="font-retro text-xl text-[#a0a0c0] leading-relaxed">
                {t('about.bio') as string}
              </p>
            </div>

            {/* Education Card - Retro Style */}
            <div 
              ref={educationRef}
              className="relative p-6"
              style={{
                background: 'rgba(26, 26, 62, 0.9)',
                border: '4px solid #6b4ee6',
                boxShadow: '6px 6px 0 #ff6b9d',
              }}
            >
              {/* Pixel corner decorations */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#ffd700]" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#ffd700]" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#ffd700]" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#ffd700]" />

              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center"
                  style={{
                    background: '#6b4ee6',
                    boxShadow: '3px 3px 0 #ff6b9d',
                  }}
                >
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-pixel text-xs text-[#00d4ff]">
                  {t('education.heading') as string}
                </h3>
              </div>
              
              <h4 className="font-retro text-xl text-white mb-2">
                {t('education.degree') as string}
              </h4>
              
              <p className="font-retro text-lg text-[#a0a0c0] leading-relaxed">
                {t('education.desc') as string}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
