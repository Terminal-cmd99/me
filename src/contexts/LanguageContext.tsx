import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[];
}

const translations = {
  en: {
    // Hero
    'hero.title': 'Software Developer',
    'hero.subtitle': 'Building reliable systems with clarity and purpose.',
    
    // About
    'about.heading': 'About Me',
    'about.bio': 'I am a software developer with an engineering background and experience in enterprise systems. I enjoy building structured, maintainable software and continuously learning how technology, AI, and business work together to create value.',
    
    // Education
    'education.heading': 'Education',
    'education.degree': "Bachelor's Degree — Computer Engineering",
    'education.desc': 'Graduated in Computer Engineering, with a strong foundation in programming, system design, databases, and software engineering principles.',
    
    // Skills
    'skills.heading': 'Skills',
    'skills.backend': 'Backend',
    'skills.frontend': 'Frontend',
    'skills.database': 'Database',
    'skills.tools': 'Tools',
    'skills.csharp': 'C#',
    'skills.aspnet': 'ASP.NET / ASP.NET Core',
    'skills.restapi': 'REST API',
    'skills.react': 'React (Basic – Intermediate)',
    'skills.sqlserver': 'SQL Server',
    'skills.postgresql': 'PostgreSQL',
    'skills.storedproc': 'Stored Procedures',
    'skills.queryopt': 'Query Optimization',
    'skills.git': 'Git / GitLab',
    
    // Experience
    'experience.heading': 'Work Experience',
    'experience.company': 'IT-CAT Co., Ltd.',
    'experience.location': 'Chiang Mai, Thailand',
    'experience.role': 'Software Developer',
    'experience.period': '2022 — Present (2.5 Years)',
    'experience.desc1': 'Developed and maintained enterprise web applications using ASP.NET and ASP.NET Core',
    'experience.desc2': 'Implemented backend logic with C#',
    'experience.desc3': 'Worked with SQL Server and PostgreSQL, including queries and performance optimization',
    'experience.desc4': 'Maintained and improved existing systems used in real business operations',
    
    // AI Interest
    'ai.heading': 'Interest: AI & Business',
    'ai.desc': 'Interested in how AI can enhance software systems, improve efficiency, and support better business decisions. Actively learning how technology can be applied beyond code — into products, processes, and real-world impact.',
    
    // Lifestyle
    'lifestyle.heading': 'Lifestyle & Interests',
    'lifestyle.item1': 'Enjoys calm environments',
    'lifestyle.item2': 'Likes nature and mountains',
    'lifestyle.item3': 'Music while driving or thinking',
    'lifestyle.item4': 'Values balance between work, learning, and life',
    
    // Philosophy
    'philosophy.heading': 'Philosophy',
    'philosophy.item1': 'Build with clarity.',
    'philosophy.item2': 'Technology should create value.',
    'philosophy.item3': 'Learn continuously.',
    
    // Contact
    'contact.heading': 'Contact',
    'contact.subtitle': "Feel free to reach out if you'd like to collaborate or exchange ideas.",
    'contact.email': 'your.email@example.com',
    
    // Footer
    'footer.text': 'Built with care and continuous learning',
  },
  th: {
    // Hero
    'hero.title': 'นักพัฒนาซอฟต์แวร์',
    'hero.subtitle': 'พัฒนาระบบที่ใช้งานได้จริง ด้วยความชัดเจนและมีเป้าหมาย',
    
    // About
    'about.heading': 'เกี่ยวกับผม',
    'about.bio': 'ผมเป็นนักพัฒนาซอฟต์แวร์ที่มีพื้นฐานด้านวิศวกรรม และมีประสบการณ์ทำงานกับระบบระดับองค์กร ชื่นชอบการพัฒนาซอฟต์แวร์ที่เป็นระบบ ดูแลต่อได้ง่าย และเรียนรู้การผสานเทคโนโลยี AI เข้ากับมุมมองทางธุรกิจเพื่อสร้างคุณค่า',
    
    // Education
    'education.heading': 'การศึกษา',
    'education.degree': 'ปริญญาตรี — วิศวกรรมคอมพิวเตอร์',
    'education.desc': 'สำเร็จการศึกษาระดับปริญญาตรี สาขาวิศวกรรมคอมพิวเตอร์ มีพื้นฐานด้านการเขียนโปรแกรม การออกแบบระบบ ฐานข้อมูล และหลักการวิศวกรรมซอฟต์แวร์',
    
    // Skills
    'skills.heading': 'ทักษะ',
    'skills.backend': 'Backend',
    'skills.frontend': 'Frontend',
    'skills.database': 'Database',
    'skills.tools': 'Tools',
    'skills.csharp': 'C#',
    'skills.aspnet': 'ASP.NET / ASP.NET Core',
    'skills.restapi': 'REST API',
    'skills.react': 'React (Basic – Intermediate)',
    'skills.sqlserver': 'SQL Server',
    'skills.postgresql': 'PostgreSQL',
    'skills.storedproc': 'Stored Procedures',
    'skills.queryopt': 'Query Optimization',
    'skills.git': 'Git / GitLab',
    
    // Experience
    'experience.heading': 'ประสบการณ์ทำงาน',
    'experience.company': 'บริษัท ไอที-แคท จำกัด',
    'experience.location': 'เชียงใหม่ ประเทศไทย',
    'experience.role': 'นักพัฒนาซอฟต์แวร์',
    'experience.period': '2565 — ปัจจุบัน (2.5 ปี)',
    'experience.desc1': 'พัฒนาและดูแลระบบเว็บระดับองค์กรด้วย ASP.NET และ ASP.NET Core',
    'experience.desc2': 'เขียน logic ฝั่ง backend ด้วย C#',
    'experience.desc3': 'ทำงานกับ SQL Server และ PostgreSQL รวมถึงการปรับปรุงประสิทธิภาพ',
    'experience.desc4': 'ดูแลและพัฒนาระบบที่ถูกใช้งานจริงในกระบวนการทางธุรกิจ',
    
    // AI Interest
    'ai.heading': 'ความสนใจ: AI & ธุรกิจ',
    'ai.desc': 'สนใจการนำ AI มาประยุกต์ใช้กับระบบซอฟต์แวร์ เพื่อเพิ่มประสิทธิภาพและช่วยสนับสนุนการตัดสินใจทางธุรกิจ ให้ความสำคัญกับการมองเทคโนโลยีในมุมที่สร้างผลลัพธ์จริง ไม่ใช่แค่การเขียนโค้ด',
    
    // Lifestyle
    'lifestyle.heading': 'ไลฟ์สไตล์ & ความสนใจ',
    'lifestyle.item1': 'ชอบบรรยากาศสงบ',
    'lifestyle.item2': 'ชอบธรรมชาติและภูเขา',
    'lifestyle.item3': 'ฟังเพลงระหว่างขับรถหรือคิดงาน',
    'lifestyle.item4': 'ให้ความสำคัญกับสมดุลระหว่างงาน การเรียนรู้ และชีวิต',
    
    // Philosophy
    'philosophy.heading': 'ปรัชญาการทำงาน',
    'philosophy.item1': 'พัฒนาอย่างมีความชัดเจน',
    'philosophy.item2': 'เทคโนโลยีควรสร้างคุณค่า',
    'philosophy.item3': 'เรียนรู้อย่างต่อเนื่อง',
    
    // Contact
    'contact.heading': 'ติดต่อ',
    'contact.subtitle': 'สามารถติดต่อได้หากสนใจร่วมงานหรือแลกเปลี่ยนไอเดีย',
    'contact.email': 'your.email@example.com',
    
    // Footer
    'footer.text': 'สร้างด้วยความใส่ใจและการเรียนรู้อย่างต่อเนื่อง',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-language') as Language;
    if (saved && (saved === 'en' || saved === 'th')) {
      setLanguageState(saved);
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('portfolio-language', lang);
    // Update body data-lang attribute for CSS font switching
    document.body.setAttribute('data-lang', lang);
  };

  const t = (key: string): string | string[] => {
    const value = translations[language][key as keyof typeof translations.en];
    return value || key;
  };

  // Set initial data-lang attribute
  useEffect(() => {
    if (isLoaded) {
      document.body.setAttribute('data-lang', language);
    }
  }, [isLoaded, language]);

  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
