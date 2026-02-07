import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Server, Layout, Database, Wrench } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    key: 'backend',
    icon: Server,
    color: '#ff6b9d',
    skills: ['csharp', 'aspnet', 'restapi'],
  },
  {
    key: 'frontend',
    icon: Layout,
    color: '#00d4ff',
    skills: ['react'],
  },
  {
    key: 'database',
    icon: Database,
    color: '#6b4ee6',
    skills: ['sqlserver', 'postgresql', 'storedproc', 'queryopt'],
  },
  {
    key: 'tools',
    icon: Wrench,
    color: '#ffd700',
    skills: ['git'],
  },
];

export function Skills() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const ctx = gsap.context(() => {
      const cardElements = cards.querySelectorAll('.skill-category');

      gsap.fromTo(
        cardElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
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
      className="relative min-h-screen w-full flex items-center py-20"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="heading-lg text-white inline-block relative">
            {t('skills.heading') as string}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#00d4ff]" />
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 gap-6"
        >
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.key}
                className="skill-category relative p-6"
                style={{
                  background: 'rgba(26, 26, 62, 0.9)',
                  border: `4px solid ${category.color}`,
                  boxShadow: `6px 6px 0 ${category.color}40`,
                  transition: 'all 0.1s steps(2)',
                }}
              >
                {/* Pixel corner */}
                <div 
                  className="absolute -top-2 -right-2 w-4 h-4"
                  style={{ background: category.color }}
                />

                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 flex items-center justify-center"
                    style={{
                      background: category.color,
                      boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-pixel text-xs text-white">
                    {t(`skills.${category.key}`) as string}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-retro text-lg px-3 py-1"
                      style={{
                        background: 'rgba(107, 78, 230, 0.2)',
                        border: `2px solid ${category.color}`,
                        color: category.color,
                      }}
                    >
                      {t(`skills.${skill}`) as string}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
