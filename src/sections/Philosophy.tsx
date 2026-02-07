import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Gem, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Philosophy() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const ctx = gsap.context(() => {
      const cardElements = cards.querySelectorAll('.philosophy-card');

      gsap.fromTo(
        cardElements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
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

  const items = [
    { key: 'philosophy.item1', icon: Target, color: '#00d4ff' },
    { key: 'philosophy.item2', icon: Gem, color: '#ff6b9d' },
    { key: 'philosophy.item3', icon: BookOpen, color: '#6b4ee6' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] w-full flex items-center py-20"
    >
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="heading-md text-white inline-block relative">
            {t('philosophy.heading') as string}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#6b4ee6]" />
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-6"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="philosophy-card relative p-8 text-center"
                style={{
                  background: 'rgba(26, 26, 62, 0.9)',
                  border: `4px solid ${item.color}`,
                  boxShadow: `4px 4px 0 ${item.color}60`,
                }}
              >
                {/* Pixel corners */}
                <div 
                  className="absolute -top-2 -left-2 w-3 h-3"
                  style={{ background: item.color }}
                />
                <div 
                  className="absolute -top-2 -right-2 w-3 h-3"
                  style={{ background: item.color }}
                />

                <div className="flex justify-center mb-6">
                  <div 
                    className="w-14 h-14 flex items-center justify-center"
                    style={{
                      background: item.color,
                      boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <p className="font-pixel text-xs text-white leading-relaxed">
                  {t(item.key) as string}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
