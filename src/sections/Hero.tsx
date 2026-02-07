import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';

export function Hero() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'steps(8)' } });

      // Image fade in
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.8 },
        0
      );

      // Title reveal - pixel style
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.3
      );

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.5
      );

      // Subtle floating animation for image
      gsap.to(imageRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <p className="font-pixel text-xs text-[#00d4ff] mb-4 tracking-widest">
              {'<'}{t('hero.title') as string}{' />'}
            </p>
            
            <h1
              ref={titleRef}
              className="heading-xl text-white mb-6"
            >
              {t('hero.title') as string}
            </h1>
            
            <p
              ref={subtitleRef}
              className="font-retro text-2xl text-[#ff6b9d] leading-relaxed"
            >
              {t('hero.subtitle') as string}
            </p>

            {/* Decorative pixel line */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-2">
              <div className="w-4 h-4 bg-[#6b4ee6]" />
              <div className="w-4 h-4 bg-[#ff6b9d]" />
              <div className="w-4 h-4 bg-[#00d4ff]" />
              <div className="w-16 h-1 bg-[#6b4ee6]" />
              <div className="w-4 h-4 bg-[#ffd700]" />
            </div>
          </div>

          {/* Portrait */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div
              ref={imageRef}
              className="relative"
            >
              {/* Pixel glow effect */}
              <div 
                className="absolute inset-0 scale-110"
                style={{
                  background: 'linear-gradient(135deg, #6b4ee6 0%, #ff6b9d 50%, #00d4ff 100%)',
                  filter: 'blur(20px)',
                  opacity: 0.5,
                }}
              />
              
              {/* Image container with retro border */}
              <div 
                className="relative w-[280px] md:w-[320px] lg:w-[360px] aspect-square"
                style={{
                  boxShadow: '8px 8px 0 #ff6b9d, 16px 16px 0 rgba(107, 78, 230, 0.3)',
                }}
              >
                <img
                  src="/me/starry-bg.png"
                  alt="Pixel Art"
                  className="w-full h-full object-cover object-top"
                  style={{ imageRendering: 'pixelated' }}
                />
                
                {/* Pixel overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent 60%, rgba(10, 10, 26, 0.8) 100%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom pixel decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-4 flex">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="flex-1 h-full"
            style={{
              backgroundColor: i % 2 === 0 ? '#6b4ee6' : '#ff6b9d',
            }}
          />
        ))}
      </div>
    </section>
  );
}
