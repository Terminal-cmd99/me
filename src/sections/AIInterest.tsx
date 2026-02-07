import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Cpu, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function AIInterest() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[60vh] w-full flex items-center py-20"
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-12">
        <div ref={contentRef} className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div 
              className="relative w-20 h-20 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #6b4ee6 0%, #ff6b9d 100%)',
                boxShadow: '6px 6px 0 #00d4ff',
              }}
            >
              {/* Pixel corners */}
              <div className="absolute -top-2 -left-2 w-3 h-3 bg-[#ffd700]" />
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#ffd700]" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#ffd700]" />
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-[#ffd700]" />
              
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="heading-md text-white mb-6">
            {t('ai.heading') as string}
          </h2>

          <p className="font-retro text-xl text-[#c0c0e0] leading-relaxed max-w-2xl mx-auto">
            {t('ai.desc') as string}
          </p>

          {/* Decorative icons */}
          <div className="flex justify-center gap-8 mt-10">
            <div 
              className="w-14 h-14 flex items-center justify-center"
              style={{
                background: '#6b4ee6',
                boxShadow: '3px 3px 0 #ff6b9d',
              }}
            >
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div 
              className="w-14 h-14 flex items-center justify-center"
              style={{
                background: '#00d4ff',
                boxShadow: '3px 3px 0 #6b4ee6',
              }}
            >
              <Rocket className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
