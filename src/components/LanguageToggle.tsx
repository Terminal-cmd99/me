import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50">
      <div 
        className="flex items-center"
        style={{
          background: '#1a1a3e',
          border: '4px solid #6b4ee6',
          boxShadow: '4px 4px 0 #ff6b9d',
        }}
      >
        <button
          onClick={() => setLanguage('en')}
          className={`font-pixel text-[10px] px-4 py-3 transition-all duration-100 ${
            language === 'en' 
              ? 'bg-[#00d4ff] text-[#0a0a1a]' 
              : 'text-white hover:bg-[#6b4ee6]'
          }`}
        >
          EN
        </button>
        <div 
          className="w-px h-6"
          style={{ background: '#6b4ee6' }}
        />
        <button
          onClick={() => setLanguage('th')}
          className={`font-pixel text-[10px] px-4 py-3 transition-all duration-100 ${
            language === 'th' 
              ? 'bg-[#00d4ff] text-[#0a0a1a]' 
              : 'text-white hover:bg-[#6b4ee6]'
          }`}
        >
          TH
        </button>
      </div>
    </div>
  );
}
