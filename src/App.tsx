import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { StarryBackground } from '@/components/StarryBackground';
import { LanguageToggle } from '@/components/LanguageToggle';
import { MusicPlayer } from '@/components/MusicPlayer';
import { MiniGame } from '@/components/MiniGame';
import { ChatBot } from '@/components/ChatBot';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Skills } from '@/sections/Skills';
import { Experience } from '@/sections/Experience';
import { AIInterest } from '@/sections/AIInterest';
import { Lifestyle } from '@/sections/Lifestyle';
import { Philosophy } from '@/sections/Philosophy';
import { Contact } from '@/sections/Contact';

import './index.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenisRef.current.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      gsap.ticker.remove((time) => {
        lenisRef.current?.raf(time * 1000);
      });
    };
  }, []);

  // Refresh ScrollTrigger on language change
  useEffect(() => {
    const handleLanguageChange = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen scanlines">
        {/* Starry Background */}
        <StarryBackground />
        
        {/* Language Toggle */}
        <LanguageToggle />

        {/* YouTube Music Player */}
        <MusicPlayer />

        {/* Mini Game */}
        <MiniGame />

        {/* Chat Bot */}
        <ChatBot />

        {/* Main Content */}
        <main className="relative z-10">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <AIInterest />
          <Lifestyle />
          <Philosophy />
          <Contact />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
