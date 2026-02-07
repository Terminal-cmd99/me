import { useEffect, useRef, type MouseEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Github, Facebook, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
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
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Terminal-cmd99', label: 'GitHub', color: '#6b4ee6' },
    { icon: Facebook, href: 'https://www.facebook.com/nontawat.matong', label: 'Facebook', color: '#1877f2' },
    { icon: Instagram, href: 'https://www.instagram.com/terminal.bat/', label: 'Instagram', color: '#e4405f' },
  ];

  const handleSocialClick = (label: string, event: MouseEvent<HTMLAnchorElement>) => {
    if (label !== 'Facebook') return;
    const pass = window.prompt('ใส่รหัสผ่านเพื่อไปที่ Facebook');
    if (pass !== '0000') {
      event.preventDefault();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] w-full flex items-center justify-center py-20"
    >
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 lg:px-12 text-center">
        <div ref={contentRef}>
          <h2 className="heading-md text-white mb-4 inline-block relative">
            {t('contact.heading') as string}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#00d4ff]" />
          </h2>

          <p className="font-retro text-xl text-[#a0a0c0] mb-10">
            {t('contact.subtitle') as string}
          </p>

          {/* Email */}
          <a
            href="mailto:james.60912@gmail.com"
            className="inline-flex items-center gap-4 mb-10 group"
          >
            <div 
              className="w-14 h-14 flex items-center justify-center transition-all duration-100"
              style={{
                background: '#6b4ee6',
                boxShadow: '4px 4px 0 #ff6b9d',
              }}
            >
              <Mail className="w-7 h-7 text-white" />
            </div>
            <span className="font-retro text-xl text-[#00d4ff] group-hover:text-[#ff6b9d] transition-colors">
              james.60912@gmail.com
            </span>
          </a>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mb-16">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  onClick={(event) => handleSocialClick(link.label, event)}
                  className="w-14 h-14 flex items-center justify-center transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{
                    background: link.color,
                    boxShadow: `4px 4px 0 rgba(0,0,0,0.3)`,
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div 
            className="pt-8"
            style={{ borderTop: '4px solid #6b4ee6' }}
          >
            <p className="font-pixel text-xs text-[#6b4ee6]">
              {t('footer.text') as string}
            </p>
            
            {/* Pixel heart */}
            <div className="flex justify-center mt-4 gap-1">
              <span className="text-[#ff6b9d]">♥</span>
              <span className="text-[#6b4ee6]">♥</span>
              <span className="text-[#00d4ff]">♥</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
