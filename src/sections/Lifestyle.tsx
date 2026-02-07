import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mountain, Music, Coffee, Wind } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Lifestyle() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
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

  const items = [
    { key: 'lifestyle.item1', icon: Wind, color: '#00d4ff' },
    { key: 'lifestyle.item2', icon: Mountain, color: '#6b4ee6' },
    { key: 'lifestyle.item3', icon: Music, color: '#ff6b9d' },
    { key: 'lifestyle.item4', icon: Coffee, color: '#ffd700' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center py-20"
    >
      {/* Background overlay for readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 10, 26, 0.7) 0%, rgba(26, 26, 62, 0.8) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-12">
        <div ref={contentRef} className="text-center">
          {/* Section Title */}
          <h2 className="heading-md text-white mb-12 inline-block relative">
            {t('lifestyle.heading') as string}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#ffd700]" />
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="relative p-6"
                  style={{
                    background: 'rgba(26, 26, 62, 0.9)',
                    border: `4px solid ${item.color}`,
                    boxShadow: `4px 4px 0 ${item.color}60`,
                  }}
                >
                  {/* Pixel corner */}
                  <div 
                    className="absolute -top-2 -right-2 w-3 h-3"
                    style={{ background: item.color }}
                  />

                  <div 
                    className="w-14 h-14 mx-auto mb-4 flex items-center justify-center"
                    style={{
                      background: item.color,
                      boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="font-retro text-lg text-[#c0c0e0]">
                    {t(item.key) as string}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
